# Wizzardsk Game Finder

**Wizzardsk Game Finder** is a powerful Google Chrome extension designed to scan, catalog, and search games from https://wizzardsk.github.io/
It allows you to explore hundreds of systems and thousands of games right from your browser popup, filter by console, play games with a single click

<img width="349" height="614" alt="image" src="https://github.com/user-attachments/assets/a672070a-ee2a-40eb-9a7f-7dbf18aed158" />


---

## 🚀 Key Features

* **Online Syncing:** Automatically scrapes systems and games directly from the source website in the background
* **Database Import & Export:** Backup your catalog into a JSON file or share/import an existing game database instantly
* **Direct Play Links:** Clicking on any game in the list opens its direct play or detail link (e.g., emulator or cart link) in a new tab
* **Advanced Console Filtering:** 
  * Dedicated search bar specifically for filtering through all available consoles/systems
  * Checkbox list to handpick which consoles you want to display
  * Quick **Select All** and **Deselect All** buttons
* **Instant Game Search:** Real-time search bar to find games instantly by name
* **Multi-Language Support:** Easily switch between **English (EN)** (default) and **Portuguese (PT-BR)** directly from the header

---

## 🛠️ Installation Instructions

To install and run this extension locally in Google Chrome, follow these steps:

1. **Download the Files:** Download or clone all the extension source files into a dedicated folder on your computer. The folder should contain:
   * `manifest.json`
   * `background.js`
   * `popup.html`
   * `popup.js`

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
   * If the database is empty, click **Sync Again (Online)** to fetch all systems and games automatically, You can monitor the real-time progress right on the screen.
   * Alternatively, click **Import Database** to load wizzardsk_games_database.json with all games

2. **Searching & Filtering:**
   * Type any game title into the main search box to filter results in real-time
   * Use the **Filter by Consoles** section to check or uncheck specific systems You can use the mini search bar inside the filter box to quickly find a specific console among hundreds[cite: 4].

3. **Playing Games:**
   * Click on any game item in the list, and it will automatically open its direct link in a new browser tab

4. **Managing Data & Settings:**
   * Use **Export Database** to save your current game library as a JSON file
   * Use the language dropdown in the top-right corner to toggle between **EN** and **PT-BR** at any time

---

## 📦 Permissions Used

* `storage`: To save your game database and language preferences locally
* `scripting` & `tabs`: Used temporarily in the background to safely render pages and extract game data during synchronization
* `unlimitedStorage`: Ensures enough local storage capacity to hold large game libraries




