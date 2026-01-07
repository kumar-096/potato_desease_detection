import { useEffect, useRef, useState } from "react";
import "./App.css";

import Header from "./components/Header";
import ImageCapture from "./components/ImageCapture";
import ResultCard from "./components/ResultCard";
import HistoryCard from "./components/HistoryCard";
import WeatherRiskCard from "./components/WeatherRiskCard";

import { fetchWeatherRisk } from "./utils/weatherRisk";
import { checkImageQuality } from "./utils/imageQuality";
import { autoCropLeaf } from "./utils/autoCropLeaf";

import { useDarkMode } from "./hooks/useDarkMode";
import { useScanHistory } from "./hooks/useScanHistory";

function App() {
  /* ===============================
     STATE
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
     IMAGE UPLOAD
  =============================== */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageURL = URL.createObjectURL(file);
    setImage(file);
    setPreview(imageURL);
    setResult(null);
  };

  /* ===============================
     OPEN CAMERA
  =============================== */
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setCameraOpen(true);
    } catch {
      alert("Camera access denied or not available.");
    }
  };

  /* ===============================
     CAPTURE PHOTO
  =============================== */
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], "captured.jpg", {
        type: "image/jpeg",
      });

      const imageURL = URL.createObjectURL(file);
      setImage(file);
      setPreview(imageURL);
      setCameraOpen(false);
      stopCamera();
    });
  };

  /* ===============================
     STOP CAMERA
  =============================== */
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  /* ===============================
     WEATHER RISK
  =============================== */
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const weatherData = await fetchWeatherRisk(latitude, longitude);
        setWeather(weatherData);
      },
      () => {
        console.log("Location access denied");
      }
    );
  }, []);

  /* ===============================
     PREDICT (TF-SERVING ONLY)
  =============================== */
  const handlePredict = async () => {
    if (!image || !preview) return;

    const quality = await checkImageQuality(preview);
    if (!quality.ok) {
      alert(quality.message);
      return;
    }

    setLoading(true);

    try {
      // Auto-crop leaf
      const croppedImageURL = await autoCropLeaf(preview);
      const blob = await fetch(croppedImageURL).then((res) => res.blob());
      const croppedFile = new File([blob], "leaf.jpg", {
        type: "image/jpeg",
      });

      const formData = new FormData();
      formData.append("file", croppedFile);

      // Prediction API
      const response = await fetch("http://localhost:8001/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error("Prediction API failed: " + text);
      }

      const data = await response.json();

      setResult(data);

      addToHistory({
        prediction: data.prediction,
        confidence: data.confidence,
        date: new Date().toLocaleString(),
      });
    } catch (err) {
      console.error("❌ ERROR:", err.message);
      alert("Prediction failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     UI
  =============================== */
  return (
    <div className="app">
      <Header
        darkMode={darkMode}
        toggleDark={() => setDarkMode(!darkMode)}
      />

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
      <WeatherRiskCard weather={weather} />
      <HistoryCard history={history} onClear={clearHistory} />
    </div>
  );
}

export default App;
