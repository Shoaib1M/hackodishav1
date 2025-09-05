import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => (
  <footer id="contact" className="footer">
    <div className="footer-content">
      <nav className="footer-links">
        <Link to="/about" className="footer-link">About</Link>
        <span className="footer-dot">·</span>
        <Link to="/contact" className="footer-link">Contact</Link>
        <span className="footer-dot">·</span>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          GitHub Repo
        </a>
      </nav>
      <div className="footer-disclaimer">
        Noise data simulated for demo purposes.
      </div>
    </div>
  </footer>
);

export default Footer;