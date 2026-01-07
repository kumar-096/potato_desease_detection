import { PAGES } from "../constants/pages";
import "./Sidebar.css";

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <SidebarItem
          label="Scan Crop"
          icon="📷"
          active={activePage === PAGES.SCAN}
          onClick={() => setActivePage(PAGES.SCAN)}
        />

        <SidebarItem
          label="Scan History"
          icon="📜"
          active={activePage === PAGES.HISTORY}
          onClick={() => setActivePage(PAGES.HISTORY)}
        />

        <SidebarItem
          label="Analytics"
          icon="📊"
          active={activePage === PAGES.ANALYTICS}
          onClick={() => setActivePage(PAGES.ANALYTICS)}
        />
      </div>

      <div className="sidebar-section bottom">
        <SidebarItem
          label="Settings"
          icon="⚙️"
          active={activePage === PAGES.SETTINGS}
          onClick={() => setActivePage(PAGES.SETTINGS)}
        />

        <SidebarItem
          label="Help & FAQ"
          icon="❓"
          active={activePage === PAGES.HELP}
          onClick={() => setActivePage(PAGES.HELP)}
        />
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      className={`sidebar-item ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span className="icon">{icon}</span>
      <span className="label">{label}</span>
    </button>
  );
}
