import React, { useEffect, useState } from "react";
import "./Hero.css";

const headline = "Track & Understand Noise Pollution in Your City";

const facts = [
  "🌍 Over 100 million people in Europe are exposed to harmful noise levels daily.",
  "🎶 Prolonged exposure to sounds above 85 dB can cause permanent hearing damage.",
  "🏙️ Urban traffic is the leading source of noise pollution worldwide.",
  "💓 High noise levels are linked to increased risk of heart disease.",
  "😴 Chronic noise exposure disrupts sleep and increases stress levels.",
  "👶 Children in noisy environments struggle more with focus and learning.",
  "🛫 Airplane takeoff can reach 140 dB — louder than a rock concert.",
  "🐦 Noise pollution affects wildlife, disrupting communication and migration.",
  "🚧 Construction sites often exceed 100 dB, far above safe limits.",
  "🔊 WHO recommends average daily noise exposure not exceed 55 dB."
];

// Number of dots to show at once
const DOT_COUNT = 10;

const Hero = () => {
  const [displayed, setDisplayed] = useState("");
  const [factIdx, setFactIdx] = useState(0);
  const [fade, setFade] = useState("fade-in");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(headline.slice(0, i + 1));
      i++;
      if (i === headline.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const factInterval = setInterval(() => {
      setFade("fade-out");
      setTimeout(() => {
        setFactIdx((prev) => (prev + 1) % facts.length);
        setFade("fade-in");
      }, 500); // match transition duration
    }, 3500);
    return () => clearInterval(factInterval);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-flex">
        <div className="hero-content">
          <h1>
            {displayed}
            <span className="typing-caret" />
          </h1>
          <p className="hero-subtext">
            Powered by <span className="highlight-ai">AI</span> &amp;{" "}
            <span className="highlight-akash">Akash Cloud</span>
          </p>
          <div className="hero-cta">
            <button className="hero-btn primary">View City Noise Stats</button>
            <button className="hero-btn secondary">Analyze My Audio</button>
          </div>
        </div>
        <div className="hero-facts">
          <div className={`hero-fact ${fade}`}>{facts[factIdx]}</div>
          <div className="hero-fact-dots">
            {facts.map((_, idx) => (
              <span
                key={idx}
                className={`hero-fact-dot${
                  factIdx === idx ? " active" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;