// import React, { useEffect, useState, useRef } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
// } from "recharts";
// import Navbar from "../../components/NavBar/Navbar.jsx";
// import "./CheckLandPollution.css";

// const CheckLandPollution = () => {
//   const [data, setData] = useState([]);
//   const [states, setStates] = useState([]);
//   const [selectedState, setSelectedState] = useState("");
//   const [summary, setSummary] = useState(null);

//   const detailsRef = useRef(null);

//   useEffect(() => {
//     fetch("http://localhost:5000/api/landwaste")
//       .then((res) => res.json())
//       .then((json) => {
//         // ✅ Normalize the data so charts always use consistent keys
//         const normalized = json.map((d) => ({
//           ...d,
//           Generated: parseFloat(d.Generated_TPD || d.Generated || 0),
//           Collected: parseFloat(d.Collected_TPD || d.Collected || 0),
//           Treated: parseFloat(d.Treated_TPD || d.Treated || 0),
//           Landfilled: parseFloat(d.Landfilled_TPD || d.Landfilled || 0),
//           Year: d.Year,
//           State: d.State,
//         }));

//         setData(normalized);
//         const uniqueStates = [...new Set(normalized.map((d) => d.State))];
//         setStates(uniqueStates);
//       });
//   }, []);

//   const filteredData = data.filter((d) => d.State === selectedState);

//   useEffect(() => {
//     if (filteredData.length > 0) {
//       const first = filteredData[0];
//       const last = filteredData[filteredData.length - 1];

//       const firstVal = first.Generated;
//       const lastVal = last.Generated;
//       const diff = lastVal - firstVal;
//       const pctChange = ((diff / firstVal) * 100).toFixed(2);

//       const growthPerYear = diff / (filteredData.length - 1);
//       const predicted = lastVal + growthPerYear;

//       const untreatedGap = lastVal - last.Treated;

//       setSummary({
//         firstYear: first.Year,
//         firstVal,
//         lastYear: last.Year,
//         lastVal,
//         pctChange,
//         predicted: predicted.toFixed(2),
//         untreatedGap,
//         treatedVal: last.Treated,
//       });

//       setTimeout(() => {
//         detailsRef.current?.scrollIntoView({ behavior: "smooth" });
//       }, 300);
//     }
//   }, [selectedState]);

//   return (
//     <>
//       <Navbar />
//       <div className="land-container">
//         <h2>♻️ Land Waste Data Visualization</h2>

//         <p className="description">
//           Land pollution, especially through improper waste management, has
//           become one of the most pressing environmental issues. Excessive waste
//           generation and poor treatment practices lead to soil contamination,
//           groundwater pollution, and harmful impacts on human health. The chart
//           below shows the trends of waste generation, collection, treatment, and
//           landfill disposal for Indian states.
//         </p>

//         <div className="dropdown">
//           <label>Select State: </label>
//           <select
//             value={selectedState}
//             onChange={(e) => setSelectedState(e.target.value)}
//           >
//             <option value="">-- Select a State --</option>
//             {states.map((state) => (
//               <option key={state} value={state}>
//                 {state}
//               </option>
//             ))}
//           </select>
//         </div>

//         {selectedState && summary && (
//           <div ref={detailsRef}>
//             {/* Line Chart */}
//             <div className="chart-container">
//               <ResponsiveContainer width="100%" height={400}>
//                 <LineChart data={filteredData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="Year" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Line
//                     type="monotone"
//                     dataKey="Generated"
//                     stroke="#8884d8"
//                     name="Generated"
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="Collected"
//                     stroke="#82ca9d"
//                     name="Collected"
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="Treated"
//                     stroke="#ffc658"
//                     name="Treated"
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="Landfilled"
//                     stroke="#ff4d4d"
//                     name="Landfilled"
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Stats Summary */}
//             <div className="summary">
//               <h2>📊 Waste Generation Summary</h2>
//               <p>
//                 In <strong>{summary.firstYear}</strong>, total waste generated
//                 was <strong>{summary.firstVal} TPD</strong>. By{" "}
//                 <strong>{summary.lastYear}</strong>, it reached{" "}
//                 <strong>{summary.lastVal} TPD</strong>.
//               </p>
//               <p>
//                 This is a <strong>{summary.pctChange}%</strong>{" "}
//                 {summary.lastVal > summary.firstVal ? "increase" : "decrease"}.
//               </p>
//               <p>
//                 If the current trend continues, by{" "}
//                 <strong>{parseInt(summary.lastYear) + 1}</strong> it is expected
//                 to reach around <strong>{summary.predicted} TPD</strong>.
//               </p>
//             </div>

//             {/* Precautionary Steps */}
//             <div className="precautions">
//               <h2>🛡️ Precautionary Measures</h2>
//               <ul>{getPrecautions(summary)}</ul>
//             </div>

//             {/* Mini Comparison Bar Chart */}
//             <div className="gap-chart">
//               <h2>📉 Treatment Gap in {summary.lastYear}</h2>
//               <ResponsiveContainer width="70%" height={250}>
//                 <BarChart
//                   data={[
//                     { name: "Generated", value: summary.lastVal },
//                     { name: "Treated", value: summary.treatedVal },
//                   ]}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="value" fill="#8ab4f8" radius={[8, 8, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//               <p style={{ marginTop: "10px" }}>
//                 Untreated waste gap:{" "}
//                 <strong>{summary.untreatedGap.toFixed(2)} TPD</strong>
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// // Precautions logic
// function getPrecautions(summary) {
//   if (!summary) return null;

//   const { untreatedGap, pctChange } = summary;
//   const gap = untreatedGap;
//   const pct = parseFloat(pctChange);

//   let tips = [];

//   if (gap < 100) {
//     tips.push("Maintain strong segregation practices.");
//     tips.push("Encourage community-level composting.");
//     tips.push("Expand recycling collection centers.");
//   } else if (gap < 1000) {
//     tips.push("Strengthen municipal treatment capacity.");
//     tips.push("Introduce incentives for recycling startups.");
//     tips.push("Promote extended producer responsibility for plastics.");
//     tips.push("Launch awareness drives on home composting.");
//   } else {
//     tips.push("🚨 Expand large-scale waste treatment plants immediately.");
//     tips.push("Ban dumping untreated waste into landfills.");
//     tips.push("Invest in waste-to-energy facilities.");
//     tips.push("Mandate recycling targets for all corporations.");
//     tips.push("Emergency monitoring of soil & water contamination.");
//   }

//   if (pct > 50) {
//     tips.push(
//       "⚠️ Rapid growth detected – implement waste reduction policies urgently."
//     );
//   }

//   return tips.map((t, i) => <li key={i}>{t}</li>);
// }

// export default CheckLandPollution;

import React, { useEffect, useState, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import Navbar from "../../components/NavBar/Navbar.jsx";
import "./CheckLandPollution.css";

const CheckLandPollution = () => {
  const [data, setData] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [summary, setSummary] = useState(null);
  const [showDoc, setShowDoc] = useState(false);

  const detailsRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/landwaste")
      .then((res) => res.json())
      .then((json) => {
        const normalized = json.map((d) => ({
          ...d,
          Generated: parseFloat(d.Generated_TPD || d.Generated || 0),
          Collected: parseFloat(d.Collected_TPD || d.Collected || 0),
          Treated: parseFloat(d.Treated_TPD || d.Treated || 0),
          Landfilled: parseFloat(d.Landfilled_TPD || d.Landfilled || 0),
          Year: d.Year,
          State: d.State,
        }));

        setData(normalized);
        const uniqueStates = [...new Set(normalized.map((d) => d.State))];
        setStates(uniqueStates);
      });
  }, []);

  const filteredData = data.filter((d) => d.State === selectedState);

  useEffect(() => {
    if (filteredData.length > 0) {
      const first = filteredData[0];
      const last = filteredData[filteredData.length - 1];

      const firstVal = first.Generated;
      const lastVal = last.Generated;
      const diff = lastVal - firstVal;
      const pctChange = ((diff / firstVal) * 100).toFixed(2);

      const growthPerYear = diff / (filteredData.length - 1);
      const predicted = lastVal + growthPerYear;

      const untreatedGap = lastVal - last.Treated;

      setSummary({
        firstYear: first.Year,
        firstVal,
        lastYear: last.Year,
        lastVal,
        pctChange,
        predicted: predicted.toFixed(2),
        untreatedGap,
        treatedVal: last.Treated,
      });

      setTimeout(() => {
        detailsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [selectedState]);

  return (
    <>
      <Navbar />
      <div className="land-container">
        <div className="header-section">
          <h2>♻️ Land Waste Data Visualization</h2>
          <button className="doc-button" onClick={() => setShowDoc(!showDoc)}>
            {showDoc ? "Hide Description" : "Show Description"}
          </button>
        </div>

        {showDoc && (
          <div className="doc-box">
            <h3>📘 About This Page</h3>
            <p>
              This page helps track{" "}
              <strong>land pollution and waste management</strong> in India. You
              can view how much waste is generated, collected, treated, and sent
              to landfills across different states.
            </p>
            <h4>🔎 How to Use:</h4>
            <ul>
              <li>
                Select a <strong>state</strong> from the dropdown menu.
              </li>
              <li>
                Check trends in waste generation and treatment on the line
                chart.
              </li>
              <li>
                View <strong>summary stats</strong> and projected future values.
              </li>
              <li>
                See a <strong>gap analysis</strong> between generated and
                treated waste.
              </li>
              <li>
                Read <strong>precautionary measures</strong> for sustainable
                waste management.
              </li>
            </ul>
          </div>
        )}

        <p className="description">
          Land pollution, especially through improper waste management, has
          become one of the most pressing environmental issues. Excessive waste
          generation and poor treatment practices lead to soil contamination,
          groundwater pollution, and harmful impacts on human health. The chart
          below shows the trends of waste generation, collection, treatment, and
          landfill disposal for Indian states.
        </p>

        {/* State Dropdown */}
        <div className="dropdown">
          <label>Select State: </label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="">-- Select a State --</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* Chart + Summary + Gap + Precautions */}
        {selectedState && summary && (
          <div ref={detailsRef}>
            {/* Line Chart */}
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

            {/* Summary */}
            <div className="summary">
              <h2>📊 Waste Generation Summary</h2>
              <p>
                In <strong>{summary.firstYear}</strong>, waste generated was{" "}
                <strong>{summary.firstVal} TPD</strong>. By{" "}
                <strong>{summary.lastYear}</strong>, it reached{" "}
                <strong>{summary.lastVal} TPD</strong>.
              </p>
              <p>
                Change: <strong>{summary.pctChange}%</strong>{" "}
                {summary.lastVal > summary.firstVal ? "increase" : "decrease"}.
              </p>
              <p>
                By <strong>{parseInt(summary.lastYear) + 1}</strong>, projected
                waste is <strong>{summary.predicted} TPD</strong>.
              </p>
            </div>

            {/* Precautionary Steps */}
            <div className="precautions">
              <h2>🛡️ Precautionary Measures</h2>
              <ul>{getPrecautions(summary)}</ul>
            </div>

            {/* Gap Analysis */}
            <div className="gap-chart">
              <h2>📉 Treatment Gap in {summary.lastYear}</h2>
              <ResponsiveContainer width="70%" height={250}>
                <BarChart
                  data={[
                    { name: "Generated", value: summary.lastVal },
                    { name: "Treated", value: summary.treatedVal },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8ab4f8" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p>
                Untreated waste gap:{" "}
                <strong>{summary.untreatedGap.toFixed(2)} TPD</strong>
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Precautions
function getPrecautions(summary) {
  if (!summary) return null;
  const { untreatedGap, pctChange } = summary;
  const gap = untreatedGap;
  const pct = parseFloat(pctChange);

  let tips = [];

  if (gap < 100) {
    tips.push("Maintain segregation practices.");
    tips.push("Encourage community composting.");
    tips.push("Expand recycling centers.");
  } else if (gap < 1000) {
    tips.push("Strengthen municipal treatment capacity.");
    tips.push("Support recycling startups.");
    tips.push("Promote extended producer responsibility.");
  } else {
    tips.push("🚨 Expand treatment plants immediately.");
    tips.push("Ban dumping untreated waste into landfills.");
    tips.push("Invest in waste-to-energy plants.");
  }

  if (pct > 50) {
    tips.push("⚠️ Rapid growth – enforce stricter policies urgently.");
  }

  return tips.map((t, i) => <li key={i}>{t}</li>);
}

export default CheckLandPollution;
