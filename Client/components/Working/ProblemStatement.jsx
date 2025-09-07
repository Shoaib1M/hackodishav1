import React from "react";
import "./ProblemStatement.css";

const ProblemStatement = () => {
  const handleScrollToHero = () => {
    const heroElement = document.getElementById("hero");
    if (heroElement) {
      // The offset is to account for a sticky navbar, if you have one.
      // Adjust the value (e.g., 80) to match your navbar's height.
      const yOffset = -80;
      const y =
        heroElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section className="problem-section" id="problem">
      <div className="problem-content">
        <h2 className="problem-headline">
          The Crisis in Our Environment: A Threat We Can No Longer Ignore.
        </h2>
        <div className="problem-points">
          <div className="problem-point">
            <h3>The Invisible Air We Breathe 💨</h3>
            <p>Invisible air pollutants like PM2.5, released from everyday traffic and industry, penetrate our lungs and cause serious health issues like asthma and allergies. Understanding your local air quality is the first step toward protecting your health.</p>
          </div>
          <div className="problem-point">
            <h3>The Unheard Danger of Noise 📣</h3>
            <p>More than a mere annoyance, constant urban noise is a serious health risk that causes stress, sleep disruption, and permanent hearing loss. Our environments frequently exceed safe decibel (dB) levels, harming both human and animal life.</p>
          </div>
          <div className="problem-point">
            <h3>Our Land Under Siege 🗑️</h3>
            <p>Our planet is being overwhelmed by waste. Overflowing landfills contaminate our soil and water, while the equivalent of a garbage truck of plastic is dumped into our oceans every single minute, destroying ecosystems worldwide.</p>
          </div>
        </div>
        <button className="problem-cta" onClick={handleScrollToHero}>
          See How We Fight Back →
        </button>
      </div>
    </section>
  );
};

export default ProblemStatement;