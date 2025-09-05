import React from "react";
import Hero from "../../components/Hero/Hero.jsx";
import About from "../../components/About/About.jsx";
import Demo from "../../components/Demo/Demo.jsx";
import Working from "../../components/Working/Working.jsx";
import ClosingCTA from "../../components/ClosingCTA/ClosingCTA.jsx";
import Footer from "../../components/Footer/Footer.jsx";

const Home = () => {
  return (
    <div>
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
