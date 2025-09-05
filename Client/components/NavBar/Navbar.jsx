import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();

  // Scroll spy functionality
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "quick-demo", "working", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      if (sectionId === "about") {
        window.dispatchEvent(new Event("about-typing-trigger"));
      }
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { id: "hero", label: "Get Started", href: "#hero" },
    { id: "about", label: "About", href: "#about" },
    { id: "quick-demo", label: "Quick Demo", href: "#quick-demo" },
    { id: "working", label: "Core", href: "#working" },
    { id: "contact", label: "Contact", href: "#contact" }
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        NoiseLens
      </Link>

      {/* Desktop Navigation */}
      <ul className="nav-links desktop-nav">
        {navItems.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.id);
              }}
              className={`nav-link ${activeSection === item.id ? "active" : ""}`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Hamburger Menu Button */}
      <button
        className="hamburger"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <motion.span
          className="hamburger-line"
          animate={{
            rotate: isMenuOpen ? 45 : 0,
            y: isMenuOpen ? 6 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className="hamburger-line"
          animate={{
            opacity: isMenuOpen ? 0 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className="hamburger-line"
          animate={{
            rotate: isMenuOpen ? -45 : 0,
            y: isMenuOpen ? -6 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <ul className="mobile-nav-links">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.id);
                    }}
                    className={`mobile-nav-link ${activeSection === item.id ? "active" : ""}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
