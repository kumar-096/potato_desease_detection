export default function ImageCapture({
  cameraOpen,
  openCamera,
  videoRef,
  capturePhoto,
  handleImageChange,
  preview,
  loading,
  image,
  handlePredict,
}) {
  return (
    <div className="card">
      {/* ===============================
         BUTTON STACK (VERTICAL)
      =============================== */}
      {!cameraOpen && (
        <div className="button-stack">
          <button className="upload-btn" onClick={openCamera}>
            📸 Capture Image
          </button>

          <label className="upload-btn secondary">
            📁 Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </label>
        </div>
      )}

      {/* ===============================
         CAMERA VIEW
      =============================== */}
      {cameraOpen && (
  <div className="camera-box">
    <video ref={videoRef} autoPlay playsInline />

    <div className="button-stack">
      <button className="capture-btn" onClick={capturePhoto}>
        📷 Capture Photo
      </button>
    </div>
  </div>
)}


      {/* ===============================
         IMAGE PREVIEW
      =============================== */}
      {preview && (
        <div className="preview">
          <img src={preview} alt="Captured leaf preview" />
        </div>
      )}

      {/* ===============================
         PREDICT BUTTON
      =============================== */}
      <div className="button-stack">
        <button
          className="predict-btn"
          onClick={handlePredict}
          disabled={loading || !image}
        >
          {loading ? "🔍 Analyzing..." : "🌱 Predict Disease"}
        </button>
      </div>
    </div>
  );
}
