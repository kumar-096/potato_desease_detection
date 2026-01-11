

export default function Settings({
  settings,
  setSettings,
  addNotification,
  canInstall,
  installApp,
}) {
  return (
    <div className="card">
      <h3>⚙️ Settings</h3>

      <label>
        <input
          type="checkbox"
          checked={settings.autoCrop}
          onChange={e =>
            setSettings({ ...settings, autoCrop: e.target.checked })
          }
        />
        Auto Crop
      </label>

      <label>
        <input
          type="checkbox"
          checked={settings.enableNotifications}
          onChange={e =>
            setSettings({
              ...settings,
              enableNotifications: e.target.checked,
            })
          }
        />
        Enable Notifications
      </label>

      {canInstall && (
        <button onClick={installApp}>📱 Install App</button>
      )}

      
      <hr />

      <h4>More Settings (Coming Soon)</h4>
      <ul>
        <li>🌐 Language Preferences</li>
        <li>🔒 Privacy Controls</li>
        <li>🔔 Firebase Push Notifications</li>
        <li>📱 Mobile Notification UX</li>
        <li>🧪 Notification Testing Utilities</li>
      </ul>
    </div>
  );
}

