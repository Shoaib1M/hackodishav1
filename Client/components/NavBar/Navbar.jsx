import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">NoiseGuardian</div>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/checkfile">Check File</Link>
        </li>
        <li>
          <Link to="/checkcity">Check City</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
