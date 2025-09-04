import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home/home.jsx";
import CheckCity from "../pages/CheckCity/CheckCity.jsx";
import CheckFile from "../pages/CheckFile/CheckFile.jsx";
import Navbar from "../components/NavBar/Navbar.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkcity" element={<CheckCity />} />
        <Route path="/checkfile" element={<CheckFile />} />
      </Routes>
    </Router>
  );
}

export default App;
