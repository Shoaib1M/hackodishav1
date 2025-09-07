import React from "react";
import { useNavigate } from "react-router-dom";
import "../Hero/Hero.css"; // Import Hero styles for buttons
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

  const handleNoiseStatsClick = () => {
    navigate("/checknoisepollution");
  };

  const handleTrashDetectorClick = () => {
    navigate("/checkimage");
  };

  const handleLandPollutionStatsClick = () => {
    navigate("/checklandpollution");
  };

  return (
    <section className="closing-cta-section">
      <div className="closing-cta-content">
        <h2 className="closing-cta-text">
          Understand Your City Better, One Pollution at a Time.
        </h2>
        <div className="closing-cta-buttons">
          <button onClick={handleCityStatsClick} className="hero-btn secondary">View City AQI</button>
          <button onClick={handleAudioAnalysisClick} className="hero-btn secondary">Analyze My Audio</button>
          <button onClick={handleNoiseStatsClick} className="hero-btn secondary">View Noise Level Stats</button>
          <button onClick={handleTrashDetectorClick} className="hero-btn secondary">Trash Detector</button>
          <button onClick={handleLandPollutionStatsClick} className="hero-btn secondary">Land Pollution Stats</button>
        </div>
      </div>
    </section>
  );
};

export default ClosingCTA;