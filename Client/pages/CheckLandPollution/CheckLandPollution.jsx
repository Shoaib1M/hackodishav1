import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./CheckLandPollution.css";

const CheckLandPollution = () => {
  const [data, setData] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/landwaste")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        const uniqueStates = [...new Set(json.map((d) => d.State))];
        setStates(uniqueStates);
        setSelectedState(uniqueStates[0]); // default first state
      });
  }, []);

  const filteredData = data.filter((d) => d.State === selectedState);

  return (
    <div className="land-container">
      <h2>♻️ Land Waste Data Visualization</h2>

      <div className="dropdown">
        <label>Select State: </label>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
        >
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Generated" stroke="#8884d8" />
            <Line type="monotone" dataKey="Collected" stroke="#82ca9d" />
            <Line type="monotone" dataKey="Treated" stroke="#ffc658" />
            <Line type="monotone" dataKey="Landfilled" stroke="#ff4d4d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CheckLandPollution;
