import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo" style={{ marginRight: "2rem" }}>NoiseLens</div>
      <ul className="nav-links">
        <li>
          <a
            href="#about"
            onClick={e => {
              e.preventDefault();
              const aboutSection = document.getElementById("about");
              if (!aboutSection) return;

              // Check if About section is in view
              const rect = aboutSection.getBoundingClientRect();
              const inView =
                rect.top >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);

              if (!inView) {
                aboutSection.scrollIntoView({ behavior: "smooth" });
                // Dispatch a custom event to trigger typing effect
                window.dispatchEvent(new Event("about-typing-trigger"));
              }
            }}
          >
            About
          </a>
        </li>
        <li>
          <a href="#quick-demo">Quick Demo</a>
        </li>
        <li>
          <a href="#working">Core</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
