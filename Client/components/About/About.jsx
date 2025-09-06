import React, { useState, useRef, useEffect } from "react";
import "./About.css";

const aboutText =
  "Every city has a hidden soundtrack, the constant hum of traffic, the buzz of construction, the chatter of daily life. But when that soundtrack grows too loud, it starts to affect our health, sleep, and peace of mind. That's where NoiseLens comes in. We built it to turn invisible noise into visible insights. Using AI, NoiseLens maps city sound patterns, highlights pollution hotspots, and reveals how noise shapes urban living. And it's not just about cities, anyone can upload their own audio to see what's really happening in their environment. In seconds, you'll know what sounds surround you, how loud they are, and what you can do to stay safe. Powered by the MERN stack and deployed on Akash Cloud's decentralized network, NoiseLens is designed to be fast, reliable, and scalable, because understanding our soundscape is the first step toward making it healthier.";

const About = () => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const typingRef = useRef();

  const backgroundImages = [
    "https://images.pexels.com/photos/20493612/pexels-photo-20493612.jpeg",
    "https://images.pexels.com/photos/31002025/pexels-photo-31002025.jpeg",
    "https://images.pexels.com/photos/32272882/pexels-photo-32272882.jpeg"
  ];

  // Typing effect function
  const startTyping = () => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    clearInterval(typingRef.current);
    typingRef.current = setInterval(() => {
      setDisplayed(aboutText.slice(0, i + 1));
      i++;
      if (i === aboutText.length) {
        clearInterval(typingRef.current);
        setDone(true);
      }
    }, 20);
  };

  // Background image carousel effect
  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(imageInterval);
  }, []);

  useEffect(() => {
    startTyping();
    // Listen for custom event
    const handler = () => startTyping();
    window.addEventListener("about-typing-trigger", handler);
    return () => {
      window.removeEventListener("about-typing-trigger", handler);
      clearInterval(typingRef.current);
    };
    // eslint-disable-next-line
  }, []);

  // Function to highlight specific words
  const highlightText = (text) => {
    const words = text.split(/(\s+)/);
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?;:]/g, '');
      if (['AI', 'MERN', 'Akash'].includes(cleanWord)) {
        return (
          <span key={index} className="highlight-word">
            {word}
          </span>
        );
      }
      return word;
    });
  };

  return (
    <section id="about" className="about-section">
      {/* Background Images Carousel */}
      <div className="about-background">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`about-bg-image ${
              index === currentImageIndex ? 'active' : ''
            }`}
            style={{
              backgroundImage: `url(${image})`,
            }}
          />
        ))}
      </div>
      <div className="about-content">
        <h2 className="about-heading">About PolSense</h2>
        <p className="about-text">
          {highlightText(displayed)}
          <span className={`about-caret${done ? " hide" : ""}`} />
        </p>
      </div>
    </section>
  );
};

export default About;