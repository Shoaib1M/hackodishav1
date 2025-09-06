import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/NavBar/Navbar.jsx";

function Layout() {
  const [pendingLocation, setPendingLocation] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // This function will be called by Navbar when the exit animation is done
  const handleExitComplete = () => {
    if (pendingLocation) {
      navigate(pendingLocation);
      setPendingLocation(null);
    }
  };

  return (
    <>
      <Navbar onExitComplete={handleExitComplete} setPendingLocation={setPendingLocation} />
      <Outlet />
    </>
  );
}

export default Layout;