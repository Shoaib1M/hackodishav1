import React, { useState } from "react";
import "./CheckImage.css";

const CheckImage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);

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
    <div className="checkimage-container">
      <h1>Waste Classification</h1>
      <p>Upload an image to classify waste.</p>

      <input type="file" accept="image/*" onChange={handleFileChange} />
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
  );
};

export default CheckImage;
