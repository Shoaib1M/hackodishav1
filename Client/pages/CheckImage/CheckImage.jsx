import React, { useState } from "react";
import "./CheckImage.css";
import Navbar from "../../components/NavBar/Navbar.jsx";

const CheckImage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHowToUse, setShowHowToUse] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setResultImage(null); // reset old results
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select an image first!");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:5001/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Prediction failed");

      const blob = await response.blob();
      setResultImage(URL.createObjectURL(blob));
    } catch (error) {
      console.error(error);
      alert("Error uploading image!");
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
              <li>The result will be displayed with the detected waste.</li>
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
            limit agricultural output. The charts below show the historical
            levels of solid waste generation and land degradation across Indian
            cities compared against permissible thresholds.
          </p>
        </div>
        <div className="checkimage-content">
          <div className="file-input-wrapper">
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <button onClick={handleUpload} disabled={loading}>
            {loading ? "Processing..." : "Upload & Detect"}
          </button>

          {selectedFile && !resultImage && (
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
        </div>
      </div>
    </>
  );
};

export default CheckImage;
