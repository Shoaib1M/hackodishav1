import React, { useState, useRef, useEffect } from "react";
import "./About.css";

const aboutText =
  "NoiseLens is an innovative platform that empowers citizens to understand and combat urban noise pollution through cutting-edge AI technology. Our system analyzes real-time noise data from cities worldwide, providing detailed insights into sound patterns, pollution hotspots, and health impacts. Users can upload their own audio recordings for instant analysis, receiving personalized recommendations for hearing protection and exposure management. Built with modern web technologies and deployed on Akash Cloud's decentralized infrastructure for maximum reliability and scalability.";

const About = () => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const typingRef = useRef();

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

  return (
    <section id="about" className="about-section">
      <h2 className="about-heading">About NoiseLens</h2>
      <p className="about-text">
        {displayed}
        <span className={`about-caret${done ? " hide" : ""}`} />
      </p>
    </section>
  );
};

export default About;