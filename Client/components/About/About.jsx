import React, { useState, useRef, useEffect } from "react";
import "./About.css";

const aboutText =
  "Every environment has a hidden layer—smog in the air, chemicals in the water, and the constant noise around us. These invisible pollutants build up quietly, but their impact on our health, safety, and quality of life is loud and clear. That’s where SwachhLens comes in. We built it to turn unseen pollution into visible insights. Using AI, SwachhLens monitors environmental patterns, identifies pollution hotspots, and reveals how our surroundings shape the way we live. And it’s not just about cities—anyone can upload their own recordings or data to uncover what’s really happening in their environment. In seconds, you’ll see the types of pollution present, how severe they are, and what actions you can take to stay safe. Powered by the MERN stack and deployed on Akash Cloud’s decentralized network, SwachhLens is designed to be fast, reliable, and scalable—because understanding pollution is the first step toward creating a healthier world.";

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
    const techKeywords = new Set(['ai', 'mern', 'akash']);
    const softKeywords = new Set([
      'swachhlens', 'decentralized', 'fast', 'reliable', 'scalable',
      'pollution', 'hotspots', 'environment', 'health', 'safety', 'air', 'water', 'noise'
    ]);
    const words = text.split(/(\s+)/);
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?;:’'"—-]/g, '').toLowerCase();
      if (techKeywords.has(cleanWord)) {
        const cls = cleanWord === 'akash' ? 'highlight-word-red' : 'highlight-word';
        return <span key={index} className={cls}>{word}</span>;
      }
      if (softKeywords.has(cleanWord)) {
        return <span key={index} className="soft-highlight">{word}</span>;
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
        <h2 className="about-heading">About SwachhLens</h2>
        <p className="about-text">
          {highlightText(displayed)}
          <span className={`about-caret${done ? " hide" : ""}`} />
        </p>
      </div>
    </section>
  );
};

export default About;