import React from "react";
import "./Demo.css";

const Demo = () => (
  <section id="quick-demo" className="demo-section">
    <h2 className="demo-title">Quick Demo</h2>
    <div className="demo-cards">
      {/* Card 1: City Stats */}
      <div className="demo-card">
        <h3>City Stats</h3>
        <div className="demo-placeholder">[Line Chart Here]</div>
        <div className="demo-avg"><span className="demo-avg-value"></span></div>
        <button className="demo-btn">Try It &rarr;</button>
      </div>
      {/* Card 2: Audio Analysis */}
      <div className="demo-card">
        <h3>Audio Analysis</h3>
        <div className="demo-placeholder">[Audio Input Here]</div>
        <button className="demo-btn">Analyze My Audio</button>
      </div>
    </div>
  </section>
);

export default Demo;