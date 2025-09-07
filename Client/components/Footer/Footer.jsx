import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => (
  <footer id="contact" className="footer">
    <div className="footer-content">
      <nav className="footer-links">
        <Link to="/about" className="footer-link">Documentation / PPT</Link>
        <span className="footer-dot">·</span>
        
        <span className="footer-dot">·</span>
        <a
          href="https://github.com/Shoaib1M/hackodishav1"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          GitHub Repo
        </a>
      </nav>
    </div>
  </footer>
);

export default Footer;