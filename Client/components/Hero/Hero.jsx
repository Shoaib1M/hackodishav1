import React, { useEffect, useState } from "react";
import "./Hero.css";
import { useNavigate } from "react-router-dom";

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
  "🔊 WHO recommends average daily noise exposure not exceed 55 dB.",
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

  // CSS-in-JS for animated wave effect - positioned to cover entire section
  const waveStyles = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' fill='%2300e6a8' fill-opacity='0.15'/%3E%3C/svg%3E\")",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center bottom",
    animation: "wave 8s ease-in-out infinite",
    zIndex: 1,
  };

  const wave2Styles = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z' fill='%23ffffff' fill-opacity='0.08'/%3E%3C/svg%3E\")",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center bottom",
    animation: "wave 6s ease-in-out infinite reverse",
    zIndex: 2,
  };

  const wave3Styles = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1110-46.29,1200,52.47V0Z' fill='%2300e6a8' fill-opacity='0.12'/%3E%3C/svg%3E\")",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center bottom",
    animation: "wave 10s ease-in-out infinite",
    zIndex: 3,
  };

  const navigate = useNavigate();

  function handleClick1() {
    // Trigger navbar slide-out animation
    if (window.triggerNavbarSlideOut) {
      window.triggerNavbarSlideOut();
    }
    // Navigate after a delay to allow animation to start
    setTimeout(() => {
      navigate("/checkcity");
    }, 200);
  }
  function handleClick2() {
    navigate("/checkfile");
  }

  return (
    <section id="hero" className="hero-section">
      {/* Animated Wave Backgrounds */}
      <div style={waveStyles}></div>
      <div style={wave2Styles}></div>
      <div style={wave3Styles}></div>

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
            <button onClick={handleClick1} className="hero-btn primary">
              View City Noise Stats
            </button>
            <button onClick={handleClick2} className="hero-btn secondary">
              Analyze My Audio
            </button>
          </div>
        </div>
        <div className="hero-facts">
          <div className={`hero-fact ${fade}`}>{facts[factIdx]}</div>
          <div className="hero-fact-dots">
            {facts.map((_, idx) => (
              <span
                key={idx}
                className={`hero-fact-dot${factIdx === idx ? " active" : ""}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
