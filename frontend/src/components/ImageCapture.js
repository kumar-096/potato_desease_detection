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
      {!cameraOpen && (
        <>
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
        </>
      )}

      {cameraOpen && (
        <div className="camera-box">
          <video ref={videoRef} autoPlay playsInline />
          <button className="capture-btn" onClick={capturePhoto}>
            📷 Capture Photo
          </button>
        </div>
      )}

      {preview && (
        <div className="preview">
          <img src={preview} alt="Leaf Preview" />
        </div>
      )}

      <button
        className="predict-btn"
        onClick={handlePredict}
        disabled={loading || !image}
      >
        {loading ? "Analyzing..." : "Predict Disease"}
      </button>
    </div>
  );
}
