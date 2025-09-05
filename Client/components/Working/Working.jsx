import React from "react";
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
    title: "Upload / Record",
    desc: "Upload an audio file or record live with your mic.",
    example: "",
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

const Working = () => (
  <section className="working-section" id="working">
    <FlowRow title="City Noise Stats — How it Works" steps={cityFlow} />
    <FlowRow title="Audio Analysis — How it Works" steps={audioFlow} />
    <TechHighlight />
  </section>
);

export default Working;