import { useEffect, useRef, useState } from "react";
import "./App.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ImageCapture from "./components/ImageCapture";
import ResultCard from "./components/ResultCard";
import HistoryCard from "./components/HistoryCard";
import WeatherRiskCard from "./components/WeatherRiskCard";
import AuthPage from "./components/auth/AuthPage";

import { fetchWeatherRisk } from "./utils/weatherRisk";
import { checkImageQuality } from "./utils/imageQuality";
import { autoCropLeaf } from "./utils/autoCropLeaf";

import { useDarkMode } from "./hooks/useDarkMode";
import { useScanHistory } from "./hooks/useScanHistory";
import { PAGES } from "./constants/pages";




function App() {
  /* ===============================
     AUTH STATE
  =============================== */
  const [activePage, setActivePage] = useState(PAGES.SCAN);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /* ===============================
     APP STATE
  =============================== */
  const [weather, setWeather] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [darkMode, setDarkMode] = useDarkMode();
  const { history, addToHistory, clearHistory } = useScanHistory();

  /* ===============================
     VERIFY TOKEN ON LOAD
  =============================== */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      setAuthChecked(true);
      return;
    }

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

  /* ===============================
     LOGOUT
  =============================== */
  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  /* ===============================
     WEATHER
  =============================== */
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const data = await fetchWeatherRisk(latitude, longitude);
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
  setCameraOpen(true); // ✅ FIRST render video

  setTimeout(async () => {
    if (!videoRef.current) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });

    streamRef.current = stream;
    videoRef.current.srcObject = stream;
  }, 100); // small delay to allow DOM render
};


const capturePhoto = () => {
  if (!videoRef.current) return;

  const canvas = document.createElement("canvas");
  canvas.width = videoRef.current.videoWidth;
  canvas.height = videoRef.current.videoHeight;

  canvas.getContext("2d").drawImage(videoRef.current, 0, 0);

  canvas.toBlob((blob) => {
    if (!blob) return;

    const file = new File([blob], "leaf.jpg", { type: "image/jpeg" });
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setCameraOpen(false);

    streamRef.current?.getTracks().forEach((t) => t.stop());
  });
};


  /* ===============================
     PREDICT
  =============================== */
  const handlePredict = async () => {
    const quality = await checkImageQuality(preview);
    if (!quality?.ok) return alert(quality.message);

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const cropped = await autoCropLeaf(preview);
      const blob = await fetch(cropped).then((r) => r.blob());

      const fd = new FormData();
      fd.append("file", new File([blob], "leaf.jpg"));

      const res = await fetch("http://localhost:8001/predict", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();
      setResult(data);

      addToHistory({
        prediction: data.prediction,
        confidence: Number((data.confidence * 100).toFixed(2)),
        date: new Date().toLocaleString(),
      });
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     AUTH GUARD
  =============================== */
  if (!authChecked) return <div>Checking authentication...</div>;
  if (!isAuthenticated) return <AuthPage onLogin={() => setIsAuthenticated(true)} />;

  /* ===============================
     UI
  =============================== */
  return (
  <div className={`app-layout ${darkMode ? "dark" : ""}`}>
    <Header
      darkMode={darkMode}
      toggleDark={() => setDarkMode(!darkMode)}
      onLogout={logout}
    />

    <div className="body">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="content">
  <div className="content-wrapper">
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
        />
        <ResultCard result={result} />
      </>
    )}

    {activePage === PAGES.HISTORY && (
      <HistoryCard history={history} onClear={clearHistory} />
    )}

    {activePage === PAGES.WEATHER && (
      <WeatherRiskCard weather={weather} />
    )}

    {activePage === PAGES.ANALYTICS && (
      <div className="card">📊 Analytics (Coming Soon)</div>
    )}

    {activePage === PAGES.SETTINGS && (
      <div className="card">⚙️ Settings (Coming Soon)</div>
    )}

    {activePage === PAGES.HELP && (
      <div className="card">❓ Help & FAQ</div>
    )}
  </div>
</main>

    </div>
  </div>
);

}

export default App;
