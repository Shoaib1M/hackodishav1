import React, { useState, useRef } from "react";
import Navbar from "../../components/NavBar/Navbar.jsx";
import "./CheckFile.css";

// 🔗 API endpoint for deployed Noise ML service
const NOISE_API = "https://hackodishav1-jy25.onrender.com/predict";

const CheckFile = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [recording, setRecording] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showDesc, setShowDesc] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // 👇 Function to send audio file to backend
  const analyzeAudio = async (audioFile) => {
    const formData = new FormData();
    formData.append("file", audioFile);

    const response = await fetch(NOISE_API, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    const blob = await response.blob();
    return { chart_url: URL.createObjectURL(blob) };
  };

  const handleSubmit = async (audioFile) => {
    if (!audioFile) {
      alert("Please select or record an audio file first.");
      return;
    }
    setAnalyzing(true);
    setResult(null);
    setError("");

    try {
      const data = await analyzeAudio(audioFile);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setRecording(true);
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const recordedFile = new File([blob], "recording.wav", {
          type: "audio/wav",
        });
        handleSubmit(recordedFile);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
    } catch (err) {
      alert("Microphone access was denied.");
    }
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current?.stop();
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <header className="header">
          <h1>Audio Analyzer</h1>
          <p>Analyze sound from your environment</p>

          {/* 👇 Description Toggle */}
          <button className="desc-btn" onClick={() => setShowDesc(!showDesc)}>
            {showDesc ? "Hide Description" : "Show Description"}
          </button>

          {showDesc && (
            <div className="desc-box">
              <h3>About this page</h3>
              <p>
                <strong>Why:</strong> Analyze environmental noise by uploading
                or recording audio.
              </p>
              <p>
                <strong>How:</strong> Upload a file or record, then click
                “Analyze” to see decibel levels, safety tips, and detected
                sounds.
              </p>
              <p>
                <strong>Summary:</strong> Helps identify harmful noise exposure
                and suggests protective actions.
              </p>
            </div>
          )}
        </header>

        {/* 🎤 Upload or Record Section */}
        <div className="card">
          <h2>Upload or Record Audio</h2>
          <div className="input-section">
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button
              onClick={() => handleSubmit(file)}
              disabled={!file || analyzing}
            >
              Analyze File
            </button>
          </div>

          {/* 🎤 Record Button */}
          <div className="record-section">
            {!recording ? (
              <button onClick={startRecording} disabled={analyzing}>
                Start Recording
              </button>
            ) : (
              <button onClick={stopRecording}>Stop Recording</button>
            )}
          </div>
        </div>

        {/* 🔄 Loading */}
        {analyzing && (
          <div className="card">
            <p>Analyzing, please wait...</p>
          </div>
        )}

        {/* ❌ Error */}
        {error && (
          <div className="card error">
            <p>{error}</p>
          </div>
        )}

        {/* ✅ Results */}
        {result && (
          <div className="card results">
            <h2>Analysis Results</h2>

            {result.decibel && (
              <div className="decibel-display">
                Approximate Decibel Level: <span>{result.decibel} dB</span>
              </div>
            )}

            {result.safety_tips && (
              <>
                <h3>Safety Precautions</h3>
                <ul className="safety-tips">
                  {result.safety_tips.map((tip, idx) => (
                    <li
                      key={idx}
                      className={
                        result.decibel > 85
                          ? "danger"
                          : result.decibel > 70
                          ? "caution"
                          : "safe"
                      }
                    >
                      {tip}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {result.chart_url ? (
              <>
                <h3>Sound Classification</h3>
                <img
                  src={result.chart_url}
                  alt="Classification Chart"
                  className="chart-image"
                />
              </>
            ) : (
              <p>No classification chart available.</p>
            )}

            {result.results && (
              <>
                <h4>Top Sounds Detected:</h4>
                <ul>
                  {result.results.map(([cls, val]) => (
                    <li key={cls}>
                      {cls}: <strong>{val.toFixed(1)}%</strong>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CheckFile;
