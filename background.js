chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startSync') {
    runSync();
    sendResponse({ status: 'started' });
  }
  return true;
});

async function runSync() {
  try {
    console.log('Baixando systems.html...');
    const response = await fetch('https://wizzardsk.github.io/systems.html');
    if (!response.ok) throw new Error(`Erro HTTP ao baixar systems.html: ${response.status}`);
    
    const htmlText = await response.text();
    
    const linkRegex = /<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
    let links = [];
    let match;
    
    while ((match = linkRegex.exec(htmlText)) !== null) {
      const hrefAttr = match[1];
      const systemTitle = match[2].replace(/<[^>]*>/g, '').trim();
      const systemUrl = new URL(hrefAttr, 'https://wizzardsk.github.io/systems.html').href;
      links.push({ url: systemUrl, title: systemTitle });
    }

    let games = [];
    let completed = 0;

    for (const link of links) {
      let countForSystem = 0;
      try {
        const tab = await chrome.tabs.create({ url: link.url, active: false });

        await new Promise((resolve) => {
          const listener = (tabId, changeInfo) => {
            if (tabId === tab.id && changeInfo.status === 'complete') {
              chrome.tabs.onUpdated.removeListener(listener);
              resolve();
            }
          };
          chrome.tabs.onUpdated.addListener(listener);
          setTimeout(resolve, 5000);
        });

        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            const anchors = document.querySelectorAll('a');
            const gameData = [];
            anchors.forEach(a => {
              const figcaption = a.querySelector('figcaption');
              if (figcaption) {
                const name = figcaption.textContent.trim();
                const gameUrl = a.href;
                if (name && gameUrl) {
                  gameData.push({ name, url: gameUrl });
                }
              }
            });
            return gameData;
          }
        });

        await chrome.tabs.remove(tab.id);

        if (results && results[0] && results[0].result) {
          const extractedGames = results[0].result;
          extractedGames.forEach(game => {
            games.push({ name: game.name, system: link.title, url: game.url });
            countForSystem++;
          });
        }
      } catch (err) {
        console.error(`Erro ao processar ${link.url}:`, err);
      }

      completed++;
      chrome.runtime.sendMessage({
        action: 'progress',
        completed: completed,
        total: links.length,
        gamesCount: games.length
      }).catch(() => {}); 
    }

    chrome.storage.local.set({ wizzardsk_games: games }, () => {
      chrome.runtime.sendMessage({
        action: 'finished',
        total: games.length
      }).catch(() => {});
    });

  } catch (error) {
    console.error('Erro crítico na sincronização:', error);
    chrome.runtime.sendMessage({
      action: 'error'
    }).catch(() => {});
  }
}