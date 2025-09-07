import React, { useState } from "react";
import "./CheckImage.css";
import Navbar from "../../components/NavBar/Navbar.jsx";

const CheckImage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHowToUse, setShowHowToUse] = useState(false);
  const [predictionText, setPredictionText] = useState(null);

  // 🔗 Waste ML deployed endpoint
  const WASTE_API = "https://hackodishav1-1-iosy.onrender.com/predict";

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setResultImage(null);
    setPredictionText(null); // reset old results
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select an image first!");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(WASTE_API, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Backend error:", errText);
        throw new Error(`Prediction failed: ${errText}`);
      }

      // 🔍 Detect if backend sent JSON or an image
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("Prediction JSON:", data);
        setPredictionText(JSON.stringify(data, null, 2));
      } else {
        const blob = await response.blob();
        console.log("Received blob from backend:", blob);
        setResultImage(URL.createObjectURL(blob));
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading image: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="checkimage-container">
        <h1>Waste Classification</h1>
        <button
          className="how-to-use-btn"
          onClick={() => setShowHowToUse(!showHowToUse)}
        >
          {showHowToUse ? "Hide Description" : "Show Description"}
        </button>

        {showHowToUse && (
          <div className="how-to-use-box">
            <h3>How to Use This Tool</h3>
            <ul>
              <li>
                Click <strong>Choose File</strong> to select an image of waste
                from your device.
              </li>
              <li>A preview of your selected image will appear below.</li>
              <li>
                Click the <strong>Upload & Detect</strong> button to start the
                classification.
              </li>
              <li>
                The result will be displayed either as an annotated image or as
                prediction text.
              </li>
            </ul>
          </div>
        )}
        <div className="checkimage-description">
          <p>
            Land pollution is one of the most damaging yet neglected forms of
            environmental degradation. Improper waste disposal, unchecked
            urbanization, and excessive use of plastics have severely
            contaminated soil and reduced land productivity. Prolonged exposure
            to polluted land can harm human health, disrupt ecosystems, and
            limit agricultural output.
          </p>
        </div>

        <div className="checkimage-content">
          <div className="file-input-wrapper">
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <button onClick={handleUpload} disabled={loading}>
            {loading ? "Processing..." : "Upload & Detect"}
          </button>

          {selectedFile && !resultImage && !predictionText && (
            <div className="preview">
              <h3>Preview:</h3>
              <img src={URL.createObjectURL(selectedFile)} alt="preview" />
            </div>
          )}

          {resultImage && (
            <div className="result">
              <h3>Detected Image:</h3>
              <img src={resultImage} alt="result" />
            </div>
          )}

          {predictionText && (
            <div className="result-text">
              <h3>Prediction Result:</h3>
              <pre>{predictionText}</pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CheckImage;
