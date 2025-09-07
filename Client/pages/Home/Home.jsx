import React from "react";
import Navbar from "../../components/NavBar/Navbar.jsx";
import Hero from "../../components/Hero/Hero.jsx";
import About from "../../components/About/About.jsx";
import Demo from "../../components/Demo/Demo.jsx";
import Working from "../../components/Working/Working.jsx";
import ClosingCTA from "../../components/ClosingCTA/ClosingCTA.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import ProblemStatement from "../../components/Working/ProblemStatement.jsx";

const Home = () => {
  return (
    <div>
      <Navbar />
      <ProblemStatement />
      <Hero />
      <About />
      <Demo />
      <Working />
      <ClosingCTA />
      <Footer />
    </div>
  );
};

export default Home;
