import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/NavBar/Navbar.jsx";
import { useOutletContext } from "react-router-dom";

function Layout() {
  const [pendingLocation, setPendingLocation] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const outletContext = useOutletContext();

  const handleSetPendingLocation = (path) => {
    setPendingLocation(path);
    // This will be passed to Navbar to trigger the animation
  };

  // This function will be called by Navbar when the exit animation is done
  const handleExitComplete = () => {
    if (pendingLocation) {
      navigate(pendingLocation);
      setPendingLocation(null);
    }
  };

  return (
    <>
      <Navbar onExitComplete={handleExitComplete} setPendingLocation={handleSetPendingLocation} />
      <Outlet context={{ ...outletContext, setPendingLocation: handleSetPendingLocation }} />
    </>
  );
}

export default Layout;