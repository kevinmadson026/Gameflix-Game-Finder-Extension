# Wizzardsk Game Finder

**Wizzardsk Game Finder** is a powerful Google Chrome extension (built with Manifest V3) designed to scan, catalog, and search games from [wizzardsk.github.io](https://wizzardsk.github.io/)[cite: 1, 2]. It allows you to explore hundreds of systems and thousands of games right from your browser popup, filter by console, play games with a single click, and manage your database locally.

---

## 🚀 Key Features

* **Online Syncing:** Automatically scrapes systems and games directly from the source website in the background[cite: 1].
* **Database Import & Export:** Backup your catalog into a JSON file or share/import an existing game database instantly[cite: 4].
* **Direct Play Links:** Clicking on any game in the list opens its direct play or detail link (e.g., emulator or cart link) in a new tab[cite: 4].
* **Advanced Console Filtering:** 
  * Dedicated search bar specifically for filtering through all available consoles/systems[cite: 4].
  * Checkbox list to handpick which consoles you want to display[cite: 4].
  * Quick **Select All** and **Deselect All** buttons[cite: 4].
* **Instant Game Search:** Real-time search bar to find games instantly by name[cite: 4].
* **Multi-Language Support:** Easily switch between **English (EN)** (default) and **Portuguese (PT-BR)** directly from the header[cite: 4].

---

## 🛠️ Installation Instructions

To install and run this extension locally in Google Chrome, follow these steps:

1. **Download the Files:** Download or clone all the extension source files into a dedicated folder on your computer. The folder should contain:
   * `manifest.json`[cite: 2]
   * `background.js`[cite: 1]
   * `popup.html`[cite: 3]
   * `popup.js`[cite: 4]

2. **Open Chrome Extensions:** 
   * Open Google Chrome and navigate to `chrome://extensions/` (or click the puzzle icon in the toolbar and select *Manage extensions*).

3. **Enable Developer Mode:** 
   * Toggle the **Developer mode** switch in the top-right corner of the extensions page.

4. **Load the Extension:** 
   * Click the **Load unpacked** button in the top-left corner.
   * Select the folder where you saved your extension files.

5. **Pin to Toolbar:** 
   * Click the Extensions puzzle icon in Chrome and pin **Wizzardsk Game Finder** for quick and easy access.

---

## 📖 How to Use

1. **First Run / Syncing:**
   * Click the extension icon in your toolbar to open the popup.
   * If the database is empty, click **Sync Again (Online)** to fetch all systems and games automatically[cite: 1, 4]. You can monitor the real-time progress right on the screen.
   * Alternatively, if you already have a JSON backup, click **Import Database** to load it instantly[cite: 4].

2. **Searching & Filtering:**
   * Type any game title into the main search box to filter results in real-time[cite: 4].
   * Use the **Filter by Consoles** section to check or uncheck specific systems[cite: 4]. You can use the mini search bar inside the filter box to quickly find a specific console among hundreds[cite: 4].

3. **Playing Games:**
   * Click on any game item in the list, and it will automatically open its direct link in a new browser tab[cite: 4].

4. **Managing Data & Settings:**
   * Use **Export Database** to save your current game library as a JSON file[cite: 4].
   * Use the language dropdown in the top-right corner to toggle between **EN** and **PT-BR** at any time[cite: 4].

---

## 📦 Permissions Used

* `storage`: To save your game database and language preferences locally[cite: 2].
* `scripting` & `tabs`: Used temporarily in the background to safely render pages and extract game data during synchronization[cite: 1, 2].
* `unlimitedStorage`: Ensures enough local storage capacity to hold large game libraries[cite: 2].




