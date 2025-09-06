import React from "react";
import { useNavigate } from "react-router-dom";
import "./ClosingCTA.css";

const ClosingCTA = () => {
  const navigate = useNavigate();

  const handleCityStatsClick = () => {
    // Trigger navbar slide-out animation
    if (window.triggerNavbarSlideOut) {
      window.triggerNavbarSlideOut();
    }
    // Navigate after a delay to allow animation to start
    setTimeout(() => {
      navigate("/checkcity");
    }, 200);
  };

  const handleAudioAnalysisClick = () => {
    navigate("/checkfile");
  };

  return (
    <section className="closing-cta-section">
      <div className="closing-cta-content">
        <h2 className="closing-cta-text">
          Discover your city's soundscape today.
        </h2>
        <div className="closing-cta-buttons">
          <button onClick={handleCityStatsClick} className="hero-btn primary">View City Noise Stats</button>
          <button onClick={handleAudioAnalysisClick} className="hero-btn secondary">Analyze My Audio</button>
        </div>
      </div>
    </section>
  );
};

export default ClosingCTA;