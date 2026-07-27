document.addEventListener('DOMContentLoaded', () => {
  const syncBtn = document.getElementById('syncBtn');
  const exportBtn = document.getElementById('exportBtn');
  const importFile = document.getElementById('importFile');
  const importFileLabel = document.getElementById('importFileLabel');
  const searchInput = document.getElementById('searchInput');
  const searchConsoleInput = document.getElementById('searchConsoleInput');
  const showFavoritesOnly = document.getElementById('showFavoritesOnly');
  const favoritesFilterLabel = document.getElementById('favoritesFilterLabel');
  const gameList = document.getElementById('gameList');
  const statusDiv = document.getElementById('status');
  const consoleList = document.getElementById('consoleList');
  const selectAllBtn = document.getElementById('selectAllBtn');
  const deselectAllBtn = document.getElementById('deselectAllBtn');
  const langSelect = document.getElementById('langSelect');
  const appTitle = document.getElementById('appTitle');
  const filterHeaderTitle = document.getElementById('filterHeaderTitle');

  let allGames = [];
  let availableConsoles = [];
  let selectedConsoles = new Set();
  let favorites = new Set();
  let currentLang = 'en';
  let currentStatusState = { key: 'noGamesInitial', args: [] };

  const translations = {
    en: {
      loading: "Loading...",
      dbLoaded: (count) => `Database loaded: ${count} games.`,
      noGames: "No games found.",
      noGamesInitial: "No games found. Sync or import a database.",
      searchGamePlaceholder: "Search game...",
      favoritesFilterLabel: "Show Favorites Only",
      filterConsolesTitle: "Filter by Consoles",
      searchConsolePlaceholder: "Filter consoles...",
      selectAll: "Select All",
      deselectAll: "Deselect All",
      syncBtn: "Sync Again (Online)",
      exportBtn: "Export Database",
      importFileBtn: "Import Database",
      syncingBg: "Starting background sync...",
      syncProgress: (completed, total, gamesCount) => `Progress: ${completed}/${total} systems (${gamesCount} games)`,
      syncComplete: (total) => `Sync complete! Total: ${total} games.`,
      syncError: "Error syncing. Check Background console.",
      dbImported: (total) => `Database imported! Total: ${total} games.`,
      alertImportSuccess: (total) => `Success! ${total} games imported.`,
      alertJsonFormat: "The uploaded JSON file is not in the correct list format.",
      alertJsonError: "Error processing JSON file: ",
      alertNoGamesExport: "There are no saved games to export.",
      displayLimit: (max, total) => `Displaying ${max} of ${total} results. Refine your search.`
    },
    pt: {
      loading: "Carregando...",
      dbLoaded: (count) => `Banco carregado: ${count} jogos.`,
      noGames: "Nenhum jogo encontrado.",
      noGamesInitial: "Nenhum jogo encontrado. Sincronize ou importe um banco.",
      searchGamePlaceholder: "Pesquisar jogo...",
      favoritesFilterLabel: "Mostrar Apenas Favoritos",
      filterConsolesTitle: "Filtrar por Consoles",
      searchConsolePlaceholder: "Filtrar consoles...",
      selectAll: "Marcar Todos",
      deselectAll: "Desmarcar Todos",
      syncBtn: "Sincronizar Novamente (Online)",
      exportBtn: "Exportar Banco",
      importFileBtn: "Importar Banco",
      syncingBg: "Iniciando sincronização em segundo plano...",
      syncProgress: (completed, total, gamesCount) => `Progresso: ${completed}/${total} sistemas (${gamesCount} jogos)`,
      syncComplete: (total) => `Sincronização concluída! Total: ${total} jogos.`,
      syncError: "Erro ao sincronizar. Veja o console do Background.",
      dbImported: (total) => `Banco importado! Total: ${total} jogos.`,
      alertImportSuccess: (total) => `Sucesso! ${total} jogos importados.`,
      alertJsonFormat: "O arquivo JSON enviado não está no formato correto de lista.",
      alertJsonError: "Erro ao processar o arquivo JSON: ",
      alertNoGamesExport: "Não há jogos salvos para exportar.",
      displayLimit: (max, total) => `Exibindo ${max} de ${total} resultados. Refine sua busca.`
    }
  };

  function t(key, ...args) {
    const translation = translations[currentLang][key] || translations['en'][key];
    return typeof translation === 'function' ? translation(...args) : translation;
  }


  function setStatus(key, ...args) {
    currentStatusState = { key, args };
    statusDiv.textContent = t(key, ...args);
  }

  function updateUItexts() {
    searchInput.placeholder = t('searchGamePlaceholder');
    searchConsoleInput.placeholder = t('searchConsolePlaceholder');
    favoritesFilterLabel.textContent = t('favoritesFilterLabel');
    selectAllBtn.textContent = t('selectAll');
    deselectAllBtn.textContent = t('deselectAll');
    syncBtn.textContent = t('syncBtn');
    exportBtn.textContent = t('exportBtn');
    importFileLabel.textContent = t('importFileBtn');
    filterHeaderTitle.textContent = t('filterConsolesTitle');
    langSelect.value = currentLang;
  }

  // Carrega configurações salvas (jogos, idioma e favoritos)
  chrome.storage.local.get(['wizzardsk_games', 'wizzardsk_lang', 'wizzardsk_favorites'], (result) => {
    if (result.wizzardsk_lang) {
      currentLang = result.wizzardsk_lang;
    }
    if (result.wizzardsk_favorites && Array.isArray(result.wizzardsk_favorites)) {
      favorites = new Set(result.wizzardsk_favorites);
    }
    updateUItexts();

    if (result.wizzardsk_games && result.wizzardsk_games.length > 0) {
      allGames = result.wizzardsk_games;
      setStatus('dbLoaded', allGames.length);
      initConsoles();
      filterAndRender();
    } else {
      setStatus('noGamesInitial');
    }
  });

  // Mudança de Idioma
  langSelect.addEventListener('change', (e) => {
    currentLang = e.target.value;
    chrome.storage.local.set({ wizzardsk_lang: currentLang });
    updateUItexts();
    filterAndRender();
    setStatus(currentStatusState.key, ...currentStatusState.args);
  });

  function initConsoles() {
    const systemsSet = new Set(allGames.map(g => g.system).filter(Boolean));
    availableConsoles = Array.from(systemsSet).sort();
    selectedConsoles = new Set(availableConsoles);
    renderConsoles();
  }

  function renderConsoles() {
    consoleList.innerHTML = '';
    const consoleQuery = searchConsoleInput.value.toLowerCase();

    availableConsoles.forEach(system => {
      if (!system.toLowerCase().includes(consoleQuery)) return;

      const div = document.createElement('div');
      div.className = 'console-item';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = system;
      checkbox.checked = selectedConsoles.has(system);
      checkbox.id = `console_${system.replace(/\s+/g, '_')}`;
      
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          selectedConsoles.add(system);
        } else {
          selectedConsoles.delete(system);
        }
        filterAndRender();
      });

      const label = document.createElement('label');
      label.htmlFor = checkbox.id;
      label.textContent = system;
      label.style.cursor = 'pointer';

      div.appendChild(checkbox);
      div.appendChild(label);
      consoleList.appendChild(div);
    });
  }

  searchConsoleInput.addEventListener('input', renderConsoles);
  showFavoritesOnly.addEventListener('change', filterAndRender);

  selectAllBtn.addEventListener('click', () => {
    availableConsoles.forEach(system => selectedConsoles.add(system));
    renderConsoles();
    filterAndRender();
  });

  deselectAllBtn.addEventListener('click', () => {
    selectedConsoles.clear();
    renderConsoles();
    filterAndRender();
  });

  function filterAndRender() {
    const query = searchInput.value.toLowerCase();
    const onlyFavs = showFavoritesOnly.checked;

    const filtered = allGames.filter(g => {
      const matchesSearch = g.name.toLowerCase().includes(query);
      const matchesConsole = selectedConsoles.has(g.system);
      const gameKey = g.url || (g.name + '_' + g.system);
      const matchesFav = !onlyFavs || favorites.has(gameKey);
      return matchesSearch && matchesConsole && matchesFav;
    });

    renderGames(filtered);
  }

  syncBtn.addEventListener('click', () => {
    syncBtn.disabled = true;
    setStatus('syncingBg');
    chrome.runtime.sendMessage({ action: 'startSync' });
  });

  exportBtn.addEventListener('click', () => {
    chrome.storage.local.get(['wizzardsk_games'], (result) => {
      if (!result.wizzardsk_games || result.wizzardsk_games.length === 0) {
        alert(t('alertNoGamesExport'));
        return;
      }
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result.wizzardsk_games, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "wizzardsk_games_database.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  });

  importFile.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedGames = JSON.parse(e.target.result);
        if (Array.isArray(importedGames)) {
          chrome.storage.local.set({ wizzardsk_games: importedGames }, () => {
            allGames = importedGames;
            initConsoles();
            filterAndRender();
            setStatus('dbImported', allGames.length);
            alert(t('alertImportSuccess', allGames.length));
          });
        } else {
          alert(t('alertJsonFormat'));
        }
      } catch (err) {
        alert(t('alertJsonError') + err.message);
      }
    };
    reader.readAsText(file);
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'progress') {
      setStatus('syncProgress', message.completed, message.total, message.gamesCount);
    } else if (message.action === 'finished') {
      setStatus('syncComplete', message.total);
      syncBtn.disabled = false;
      chrome.storage.local.get(['wizzardsk_games'], (result) => {
        if (result.wizzardsk_games) {
          allGames = result.wizzardsk_games;
          initConsoles();
          filterAndRender();
        }
      });
    } else if (message.action === 'error') {
      setStatus('syncError');
      syncBtn.disabled = false;
    }
  });

  searchInput.addEventListener('input', filterAndRender);

  function renderGames(games) {
    gameList.innerHTML = '';
    if (games.length === 0) {
      gameList.innerHTML = `<div class="game-item" style="justify-content: center;">${t('noGames')}</div>`;
      return;
    }

    const maxDisplay = 150; 
    const displayGames = games.slice(0, maxDisplay);

    displayGames.forEach(game => {
      const gameKey = game.url || (game.name + '_' + game.system);
      const isFav = favorites.has(gameKey);

      const div = document.createElement('div');
      div.className = 'game-item';

      const infoDiv = document.createElement('div');
      infoDiv.className = 'game-info';
      infoDiv.innerHTML = `<strong>${escapeHtml(game.name)}</strong><span class="system-name">${escapeHtml(game.system)}</span>`;
      div.appendChild(infoDiv);

      const starSpan = document.createElement('span');
      starSpan.className = `favorite-star${isFav ? ' active' : ''}`;
      starSpan.textContent = isFav ? '★' : '☆';
      starSpan.title = currentLang === 'pt' ? 'Favoritar' : 'Favorite';

      starSpan.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita abrir o link do jogo ao clicar na estrela
        if (favorites.has(gameKey)) {
          favorites.delete(gameKey);
          starSpan.textContent = '☆';
          starSpan.classList.remove('active');
        } else {
          favorites.add(gameKey);
          starSpan.textContent = '★';
          starSpan.classList.add('active');
        }
        chrome.storage.local.set({ wizzardsk_favorites: Array.from(favorites) });

        // Se o filtro de apenas favoritos estiver ativo, atualiza a listagem na hora
        if (showFavoritesOnly.checked) {
          filterAndRender();
        }
      });

      div.appendChild(starSpan);
      
      div.addEventListener('click', () => {
        if (game.url) {
          chrome.tabs.create({ url: game.url });
        }
      });

      gameList.appendChild(div);
    });

    if (games.length > maxDisplay) {
      const info = document.createElement('div');
      info.className = 'game-item';
      info.style.color = '#888';
      info.style.justifyContent = 'center';
      info.textContent = t('displayLimit', maxDisplay, games.length);
      gameList.appendChild(info);
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
});