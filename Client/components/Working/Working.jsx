import React, { useState, useRef } from "react";
import "./Working.css";

const cityFlow = [
  {
    icon: "🌆",
    title: "Select City",
    desc: "Pick your city from the dropdown menu.",
    example: "Example: New Delhi, Bangalore, etc.",
  },
  {
    icon: "📊",
    title: "Load Dataset",
    desc: "We show a preloaded chart of day vs night noise levels.",
    example: "Graph/heatmap appears with static data.",
  },
  {
    icon: "⚠️",
    title: "Insights",
    desc: "See how your city compares to WHO safe limits.",
    example: "Avg: 78 dB (30% above safe level).",
  },
];

const audioFlow = [
  {
    icon: "🎤",
    title: "Upload",
    desc: "Upload an audio file ",
    example: "upload a wav file",
  },
  {
    icon: "🤖",
    title: "Simulated AI Analysis",
    desc: "NoiseLens (simulated AI) classifies sound type and estimates decibel level.",
    example: "Detected: Traffic Noise, 78 dB.",
  },
  {
    icon: "🛡️",
    title: "Safety Tips",
    desc: "Get instant advice on safe exposure times and protection methods.",
    example: "Limit exposure to <2 hours/day.",
  },
];

const noiseFlow = [
  {
    icon: "📁",
    title: "Upload Recording",
    desc: "Choose a recorded sound file (WAV/MP3) to analyze.",
    example: "traffic.wav, factory.mp3",
  },
  {
    icon: "🤖",
    title: "Run Analysis",
    desc: "The model classifies sound type and estimates decibel level.",
    example: "Detected: Traffic Noise, 78 dB",
  },
  {
    icon: "🧩",
    title: "Recommendations",
    desc: "Get health guidance based on the analyzed exposure level.",
    example: "Use ear protection >85 dB",
  },
];

const landFlow = [
  {
    icon: "🗺️",
    title: "Pick State",
    desc: "Choose a state to load its yearly land-waste dataset.",
    example: "Manipur, Kerala, Maharashtra, ...",
  },
  {
    icon: "📊",
    title: "Trends Chart",
    desc: "View generated, collected, treated, and landfilled waste.",
    example: "Multi-line chart updates instantly.",
  },
  {
    icon: "🔎",
    title: "Compare & Learn",
    desc: "Identify gaps and improvements across years for policy insights.",
    example: "Collection ↑, Landfill ↓",
  },
];

const aqiFlow = [
  {
    icon: "🗺️",
    title: "Explore Map",
    desc: "Pan/zoom a global AQI heatmap overlay.",
    example: "World view with AQI tiles.",
  },
  {
    icon: "🏙️",
    title: "Select Station",
    desc: "Choose a country and city station to fetch live AQI.",
    example: "Dominant pollutant + last updated",
  },
  {
    icon: "📉",
    title: "Forecast",
    desc: "View PM2.5 min/avg/max trends to plan ahead.",
    example: "Chart for upcoming days",
  },
];

const FlowRow = ({ title, steps }) => (
  <div className="working-flow">
    <h3 className="working-flow-title">{title}</h3>
    <div className="working-cards">
      {steps.map((step, idx) => (
        <div className="working-card" key={idx}>
          <div className="working-icon">{step.icon}</div>
          <div className="working-step-title">{step.title}</div>
          <div className="working-step-desc">{step.desc}</div>
          {step.example && (
            <div className="working-step-example">{step.example}</div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const TechHighlight = () => (
  <section className="tech-section" id="tech">
    <div className="tech-logos">
      <span className="tech-logo" title="React">
        <span className="tech-emoji">⚛️</span>
        <span className="tech-label">React</span>
      </span>
      <span className="tech-logo" title="Flask">
        <span className="tech-emoji">🐍</span>
        <span className="tech-label">Flask</span>
      </span>
      <span className="tech-logo" title="MongoDB">
        <span className="tech-emoji">🍃</span>
        <span className="tech-label">MongoDB</span>
      </span>
      <span className="tech-logo" title="Akash">
        <span className="tech-emoji">☁️</span>
        <span className="tech-label">Akash</span>
      </span>
    </div>
    <div className="tech-text">
      Deployed on decentralized cloud for scalability &amp; reliability.
    </div>
  </section>
);

const mainCards = [
  { key: "city", icon: "🌆", title: "City Noise Stats", steps: cityFlow },
  { key: "audio", icon: "🎤", title: "Audio Analysis", steps: audioFlow },
  { key: "noise", icon: "🔊", title: "Noise Pollution Monitor", steps: noiseFlow },
  { key: "land", icon: "♻️", title: "Land Waste Insights", steps: landFlow },
  { key: "aqi", icon: "🌍", title: "Global AQI Map", steps: aqiFlow },
];

const Working = () => {
  const [activeKey, setActiveKey] = useState(null);
  const mainRef = useRef(null);
  const detailRef = useRef(null);
  const headlineRef = useRef(null);

  const scrollWithOffset = (ref, offset = 90) => {
    const el = ref.current;
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const handleCardClick = (key) => {
    setActiveKey(key);
    // Scroll after the DOM updates this frame
    requestAnimationFrame(() => scrollWithOffset(detailRef));
  };

  const handleBack = () => {
    setActiveKey(null);
    // Wait for detail DOM to unmount, then scroll
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollWithOffset(headlineRef));
    });
  };

  return (
    <section className="working-section" id="working">
      <h3 ref={headlineRef} className="working-flow-title">Core Features</h3>
      {/* Main 5-card grid in 3-2 formation */}
      <div ref={mainRef} className={`main-cards ${activeKey ? "faded" : ""}`}>
        <div className="main-row row-1">
          {mainCards.slice(0, 3).map((c) => (
            <button
              key={c.key}
              className={`main-card ${activeKey && activeKey !== c.key ? "dim" : ""}`}
              onClick={() => handleCardClick(c.key)}
            >
              <span className="main-icon">{c.icon}</span>
              <span className="main-title">{c.title}</span>
            </button>
          ))}
        </div>
        <div className="main-row row-2">
          {mainCards.slice(3).map((c) => (
            <button
              key={c.key}
              className={`main-card ${activeKey && activeKey !== c.key ? "dim" : ""}`}
              onClick={() => handleCardClick(c.key)}
            >
              <span className="main-icon">{c.icon}</span>
              <span className="main-title">{c.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Detail 3-step flow for the selected card */}
      {activeKey && (
        <div ref={detailRef} className="detail-flow">
          <h3 className="working-flow-title">
            {mainCards.find((c) => c.key === activeKey)?.title} — How it Works
          </h3>
          <div className="working-cards">
            {mainCards
              .find((c) => c.key === activeKey)
              ?.steps.map((step, idx) => (
                <div className="working-card" key={idx}>
                  <div className="working-icon">{step.icon}</div>
                  <div className="working-step-title">{step.title}</div>
                  <div className="working-step-desc">{step.desc}</div>
                  {step.example && (
                    <div className="working-step-example">{step.example}</div>
                  )}
                  {idx === 2 && (
                    <button className="back-btn" onClick={handleBack}>Back</button>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      <TechHighlight />
    </section>
  );
};

export default Working;