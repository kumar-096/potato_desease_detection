export default function Settings({ settings, setSettings }) {
  return (
    <div className="card settings">
      <h3>⚙️ Settings</h3>

      {/* ===============================
          ACTIVE SETTINGS
      =============================== */}
      <section className="settings-section">
        <h4>Preferences</h4>

        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings.enableNotifications}
            onChange={(e) =>
              setSettings({
                ...settings,
                enableNotifications: e.target.checked,
              })
            }
          />
          <span>Enable Notifications</span>
        </label>

        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings.highQualityCamera}
            onChange={(e) =>
              setSettings({
                ...settings,
                highQualityCamera: e.target.checked,
              })
            }
          />
          <span>High Quality Camera</span>
        </label>

        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings.autoCrop}
            onChange={(e) =>
              setSettings({
                ...settings,
                autoCrop: e.target.checked,
              })
            }
          />
          <span>Auto Crop Leaf</span>
        </label>
      </section>

      {/* ===============================
          COMING SOON SETTINGS
      =============================== */}
      <section className="settings-section muted">
        <h4>More Settings (Coming Soon)</h4>

        <div className="setting-disabled">
          🌐 Language Preferences
        </div>

        <div className="setting-disabled">
          🔒 Privacy Controls
        </div>

        <p className="settings-note">
          These options will be available in future updates.
        </p>
      </section>
    </div>
  );
}
