import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Demo.css";

const cardsData = [
  {
    title: "City AQI Stats",
    placeholder: "[AQI Heatmap Preview]",
    description: "Real-time air quality index.",
    path: "/checkcity",
    buttonText: "View City AQI",
  },
  {
    title: "Audio Analysis",
    placeholder: "[Audio Upload Form]",
    description: "Check noise levels from audio.",
    path: "/checkfile",
    buttonText: "Analyze My Audio",
  },
  {
    title: "Noise Pollution Stats",
    placeholder: "[Noise Map Preview]",
    description: "Historical noise level data.",
    path: "/checknoisepollution",
    buttonText: "View Noise Stats",
  },
  {
    title: "Trash Detector",
    placeholder: "[Image Upload Form]",
    description: "Detect trash in images.",
    path: "/trash-detector",
    buttonText: "Try Trash Detector",
  },
  {
    title: "Land Pollution Stats",
    placeholder: "[Data Visualization]",
    description: "Analyze land pollution trends.",
    path: "/land-pollution-stats",
    buttonText: "View Land Stats",
  },
];

const Demo = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section id="quick-demo" className="demo-section">
      <h2 className="demo-title">Quick Demo</h2>
      <div className="demo-carousel-wrapper">
        <div className="demo-carousel">
            {cardsData.map((card, index) => {
            let offset = index - currentIndex;
            if (offset > cardsData.length / 2) {
              offset -= cardsData.length;
            } else if (offset < -cardsData.length / 2) {
              offset += cardsData.length;
            }

            const isCenter = offset === 0;
            const isAdjacent = Math.abs(offset) === 1;

            const scale = isCenter ? 1 : isAdjacent ? 0.8 : 0.6;
            const opacity = isCenter ? 1 : isAdjacent ? 0.5 : 0;
            const x = isCenter ? "0%" : `${offset * 60}%`;
            const zIndex = isCenter ? 2 : isAdjacent ? 1 : 0;

            return (
              <motion.div
                key={`${card.title}-${index}`}
                className={`demo-card ${!isCenter ? "clickable" : ""}`}
                onClick={() => {
                  if (!isCenter) {
                    setCurrentIndex(index);
                  }
                }}
                animate={{ scale, opacity, x, zIndex }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                }}
              >
                <h3>{card.title}</h3>
                <div className="demo-placeholder">{card.placeholder}</div>
                <div className="demo-avg">
                  <span className="demo-avg-value">{card.description}</span>
                </div>
                <button
                  onClick={() => navigate(card.path)}
                  className="demo-btn"
                  disabled={!isCenter}
                >
                  {card.buttonText} &rarr;
                </button>
              </motion.div>
            );
            })}
        </div>
      </div>
    </section>
  );
};

export default Demo;