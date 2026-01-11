import { useEffect, useRef, useState } from "react";
import "./App.css";

/* ===============================
   COMPONENTS
================================ */
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ImageCapture from "./components/ImageCapture";
import ResultCard from "./components/ResultCard";
import HistoryCard from "./components/HistoryCard";
import WeatherRiskCard from "./components/WeatherRiskCard";
import AuthPage from "./components/auth/AuthPage";
import Analytics from "./components/Analytics";
import Settings from "./components/Settings";
import Help from "./components/Help";

/* ===============================
   UTILS & HOOKS
================================ */
import { fetchWeatherRisk } from "./utils/weatherRisk";
import { checkImageQuality } from "./utils/imageQuality";
import { autoCropLeaf } from "./utils/autoCropLeaf";

import { useDarkMode } from "./hooks/useDarkMode";
import { useScanHistory } from "./hooks/useScanHistory";
import { useSettings } from "./hooks/useSettings";
import { useSessionTracker } from "./hooks/useSessionTracker";
import { useNotifications } from "./hooks/useNotifications";

import { PAGES } from "./constants/pages";

/* ===============================
   ADMIN DASHBOARD
================================ */
function AdminDashboard() {
  return (
    <div className="card">
      <h3>🧑‍💼 Admin Dashboard</h3>
      <ul>
        <li>📊 System usage overview</li>
        <li>👥 User management (coming soon)</li>
        <li>🔐 Role-based access active</li>
        <li>🧪 Diagnostics tools</li>
      </ul>
    </div>
  );
}

function App() {
  /* ===============================
     CORE STATE
  =============================== */
  const [activePage, setActivePage] = useState(PAGES.SCAN);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [weather, setWeather] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

  const [online, setOnline] = useState(navigator.onLine);
  const [user, setUser] = useState(null);

  /* ===============================
     PWA INSTALL
  =============================== */
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  /* ===============================
     HOOKS
  =============================== */
  const [darkMode, setDarkMode] = useDarkMode();
  const { settings, setSettings } = useSettings();
  const { history, addToHistory } = useScanHistory(user);

  const {
    notifications,
    unreadCount,
    addNotification,
    markAllRead,
  } = useNotifications(user);

  useSessionTracker(user);

  /* ===============================
     FETCH USER
  =============================== */
  useEffect(() => {
    fetch("http://localhost:8001/me", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const u = data.user || data;
        setUser({
          ...u,
          email: u.email || u.username || "unknown@mail.com",
          role: u.role || "user",
        });
      })
      .catch(() => setUser(null));
  }, []);

  /* ===============================
     AUTH CHECK
  =============================== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setAuthChecked(true);

    fetch("http://localhost:8001/verify-token", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setIsAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      })
      .finally(() => setAuthChecked(true));
  }, []);

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  /* ===============================
     ONLINE / OFFLINE
  =============================== */
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  useEffect(() => {
    if (online && user) {
      addNotification("Internet connection restored", "info");
    }
  }, [online, user]);

  /* ===============================
     PWA INSTALL BANNER
  =============================== */
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () =>
      window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  /* ===============================
     WEATHER
  =============================== */
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(async (pos) => {
      const data = await fetchWeatherRisk(
        pos.coords.latitude,
        pos.coords.longitude
      );
      setWeather(data);
    });
  }, []);

  /* ===============================
     IMAGE HANDLING
  =============================== */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const openCamera = async () => {
    setCameraOpen(true);
    setTimeout(async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
    }, 100);
  };

  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      setPreview(URL.createObjectURL(blob));
      setCameraOpen(false);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    });
  };

  /* ===============================
     PREDICT + NOTIFICATIONS
  =============================== */
  const handlePredict = async () => {
    if (!preview || !online) return;

    const quality = await checkImageQuality(preview);
    if (!quality?.ok) return alert(quality.message);

    setLoading(true);
    try {
      const cropped = settings.autoCrop
        ? await autoCropLeaf(preview)
        : preview;

      const blob = await fetch(cropped).then((r) => r.blob());
      const fd = new FormData();
      fd.append("file", new File([blob], "leaf.jpg"));

      const res = await fetch("http://localhost:8001/predict", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: fd,
      });

      const data = await res.json();
      setResult(data);

      addToHistory({
        prediction: data.prediction,
        confidence: Number((data.confidence * 100).toFixed(2)),
        date: new Date().toLocaleString(),
      });

      addNotification(`Scan completed: ${data.prediction}`, "success");

      if (data.confidence > 0.85) {
        addNotification(
          `High confidence detected (${Math.round(
            data.confidence * 100
          )}%)`,
          "warning"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     AUTH GUARD
  =============================== */
  if (!authChecked) return <div>Checking authentication...</div>;
  if (!isAuthenticated)
    return <AuthPage onLogin={() => setIsAuthenticated(true)} />;

  /* ===============================
     UI
  =============================== */
  return (
    <div className={`app-layout ${darkMode ? "dark" : ""}`}>
      <Header
        darkMode={darkMode}
        toggleDark={() => setDarkMode(!darkMode)}
        onLogout={logout}
        user={user}
        history={history}
        settings={settings}
        notifications={notifications}
        unreadCount={unreadCount}
        markAllRead={markAllRead}
      />

      {showInstall && (
        <div className="install-banner">
          📱 Install Crop Health AI
          <button onClick={installPWA}>Install</button>
        </div>
      )}

      <div className="body">
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          user={user}
        />

        {!online && (
          <div className="offline-banner">
            📴 You are offline. Prediction disabled.
          </div>
        )}

        <main className="content">
          {activePage === PAGES.SCAN && (
            <>
              <ImageCapture
                cameraOpen={cameraOpen}
                openCamera={openCamera}
                videoRef={videoRef}
                capturePhoto={capturePhoto}
                handleImageChange={handleImageChange}
                preview={preview}
                loading={loading}
                image={image}
                handlePredict={handlePredict}
                disabled={!online}
              />
              <ResultCard result={result} />
              {result && weather && (
                <WeatherRiskCard weather={weather} />
              )}
            </>
          )}

          {activePage === PAGES.HISTORY && (
            <div className="card history">
              <h3>📜 Scan History</h3>
              {history.map((h, i) => (
                <HistoryCard key={i} {...h} />
              ))}
            </div>
          )}

          {activePage === PAGES.ANALYTICS && (
            <Analytics history={history} />
          )}

          {activePage === PAGES.ADMIN && user?.role === "admin" && (
            <AdminDashboard />
          )}

          {activePage === PAGES.SETTINGS && (
            <Settings settings={settings} setSettings={setSettings} />
          )}

          {activePage === PAGES.HELP && <Help />}
        </main>
      </div>
    </div>
  );
}

export default App;
