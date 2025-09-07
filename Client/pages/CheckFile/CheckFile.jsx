import React, { useState, useRef } from "react";
import { analyzeAudio } from "../../src/api";   // 👈 import from api.js in Client/src
import Navbar from "../../components/NavBar/Navbar.jsx";
import "./CheckFile.css";                  // 👈 adjust path if needed

const CheckFile = () => {
	const [file, setFile] = useState(null);
	const [result, setResult] = useState(null);
	const [error, setError] = useState("");
	const [recording, setRecording] = useState(false);
	const [analyzing, setAnalyzing] = useState(false);
	const mediaRecorderRef = useRef(null);
	const audioChunksRef = useRef([]);

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
				const recordedFile = new File([blob], "recording.wav", { type: "audio/wav" });
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
				</header>

				<div className="card">
					<h2>Upload or Record Audio</h2>
					<div className="input-section">
						<input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files[0])} />
						<button onClick={() => handleSubmit(file)} disabled={!file || analyzing}>
							Analyze File
						</button>
					</div>
				</div>

				{analyzing && <div className="card"><p>Analyzing, please wait...</p></div>}
				{error && <div className="card error"><p>{error}</p></div>}

				{result && (
					<div className="card results">
						<h2>Analysis Results</h2>
						<div className="decibel-display">
							Approximate Decibel Level: <span>{result.decibel} dB</span>
						</div>
						<h3>Safety Precautions</h3>
						<ul className="safety-tips">
							{result.safety_tips.map((tip, idx) => (
								<li
									key={idx}
									className={
										result.decibel > 85 ? "danger" : result.decibel > 70 ? "caution" : "safe"
									}
								>
									{tip}
								</li>
							))}
						</ul>
						<h3>Sound Classification</h3>
						{result.chart_url ? (
							<img src={result.chart_url} alt="Classification Chart" className="chart-image" />
						) : (
							<p>Chart not available.</p>
						)}
						<h4>Top Sounds Detected:</h4>
						<ul>
							{result.results.map(([cls, val]) => (
								<li key={cls}>
									{cls}: <strong>{val.toFixed(1)}%</strong>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</>
	);
};

export default CheckFile;