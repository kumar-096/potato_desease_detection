export default function Header({ darkMode, toggleDark }) {
  return (
    <header className="header">
      <div className="header-top">
        <h1>🥔 Potato Disease Detection</h1>
        <button className="theme-toggle" onClick={toggleDark}>
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
      <p>AI-powered leaf disease analysis</p>
    </header>
  );
}
