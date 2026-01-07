import { PAGES } from "../constants/pages";
import "./Sidebar.css";

function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      <button
        className={activePage === PAGES.SCAN ? "active" : ""}
        onClick={() => setActivePage(PAGES.SCAN)}
      >
        📷 Scan Crop
      </button>

      <button
        className={activePage === PAGES.HISTORY ? "active" : ""}
        onClick={() => setActivePage(PAGES.HISTORY)}
      >
        📜 Scan History
      </button>

      <button
        className={activePage === PAGES.WEATHER ? "active" : ""}
        onClick={() => setActivePage(PAGES.WEATHER)}
      >
        🌦️ Weather Risk
      </button>

      <button
        className={activePage === PAGES.ANALYTICS ? "active" : ""}
        onClick={() => setActivePage(PAGES.ANALYTICS)}
      >
        📊 Analytics
      </button>

      <button
        className={activePage === PAGES.SETTINGS ? "active" : ""}
        onClick={() => setActivePage(PAGES.SETTINGS)}
      >
        ⚙️ Settings
      </button>

      <button
        className={activePage === PAGES.HELP ? "active" : ""}
        onClick={() => setActivePage(PAGES.HELP)}
      >
        ❓ Help
      </button>
    </aside>
  );
}

export default Sidebar;
