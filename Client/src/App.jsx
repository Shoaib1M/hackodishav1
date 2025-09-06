import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home.jsx";
import CheckCity from "../pages/CheckCity/CheckCity.jsx";
import CheckFile from "../pages/CheckFile/CheckFile.jsx";
import Navbar from "../components/NavBar/Navbar.jsx";
import CheckNoisePollution from "../pages/CheckNoisePollution/CheckNoisePollution.jsx";
import LoginPage from "../pages/Login/LoginPage.jsx";
import { AuthProvider } from "./AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/checkcity" element={<CheckCity />} />
          <Route path="/checkfile" element={<CheckFile />} />
          <Route path="/checknoisepollution" element={<CheckNoisePollution />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;