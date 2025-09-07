import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Navbar.css";
import logoFinal from "../../assets/logofinal.png";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [showNavLinks, setShowNavLinks] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll spy functionality
  useEffect(() => {
    const handleScroll = () => {
      // Check if scrolled to the very bottom of the page
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2; // 2px buffer

      if (isAtBottom) {
        setActiveSection("contact");
        return;
      }

      const sections = ["problem", "hero", "about", "quick-demo", "working", "contact"];
      const scrollPosition = window.scrollY + 100;
      let currentSection = "";

      // Find the current section by iterating from the bottom up
      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionId = sections[i];
        const element = document.getElementById(sectionId);
        if (element) {
          if (scrollPosition >= element.offsetTop) {
            currentSection = sectionId;
            break;
          }
        }
      }
      
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show/hide nav links based on the current page
  useEffect(() => {
    if (location.pathname === "/") {
      setShowNavLinks(true);
    } else {
      setShowNavLinks(false);
    }
  }, [location.pathname]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Scroll to top on route change
  useEffect(() => {
    // If navigation state includes a "scrollTo" target, scroll there.
    if (location.state?.scrollTo) {
      // Use a timeout to ensure the element is available after the page transition
      setTimeout(() => scrollToSection(location.state.scrollTo), 100);
    } else {
      // Otherwise, scroll to the top of the page.
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

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

  const handleLogoClick = (e) => {
    e.preventDefault(); // Prevent the default link behavior
    if (location.pathname === "/") {
      // If on the homepage, just scroll smoothly
      scrollToSection("hero");
    } else {
      // If on another page, navigate to the homepage and pass the target section in state
      navigate("/", { state: { scrollTo: "hero" } });
    }
  };

  const navItems = [
    { id: "problem", label: "The Problem", href: "#problem" },
    { id: "hero", label: "Home", href: "#hero" },
    { id: "about", label: "About", href: "#about" },
    { id: "quick-demo", label: "Demo", href: "#quick-demo" },
    { id: "working", label: "Core Features", href: "#working" },
    { id: "contact", label: "Documentation", href: "#contact" }
  ];

  return (
    <nav className="navbar">
      <a href="/#hero" className="logo" onClick={handleLogoClick}>
        <img src={logoFinal} alt="SwachhSense Logo" className="logo-img" />
        <span>SwachhLens</span>
      </a>

      {/* Desktop Navigation */}
      <AnimatePresence>
        {showNavLinks && (
          <motion.ul
            className="nav-links desktop-nav"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
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
          </motion.ul>
        )}
      </AnimatePresence>

      {/* Hamburger Menu Button */}
      <button
        className="hamburger"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <motion.span
          className="hamburger-line"
          style={{ originX: "center" }}
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
          style={{ originX: "center" }}
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
