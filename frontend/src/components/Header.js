import "./Header.css";
function Header({ darkMode, toggleDark, onLogout }) {
  return (
    <header className="header">
      <h1>🌱 Potato Disease Detector</h1>

      <div className="header-actions">
        <button onClick={toggleDark}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        <button onClick={onLogout} className="logout-btn">
          🚪 Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
