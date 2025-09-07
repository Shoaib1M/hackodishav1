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
import "./CheckNoisePollution.css";

const CheckNoisePollution = () => {
  const [data, setData] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [summary, setSummary] = useState(null);

  const detailsRef = useRef(null);

  useEffect(() => {
    fetch("/api/noise")
      .then((res) => res.json())
      .then((json) => {
        // Normalize keys for easier usage
        const normalized = json.map((d) => ({
          Station: d.Station.trim(),
          Year: d.Year,
          Day: parseFloat(d["Day (Db)"] || d.Day || 0),
          Night: parseFloat(d["Night (Db)"] || d.Night || 0),
          DayLimit: parseFloat(d["DayLimit (Db)"] || d.DayLimit || 0),
          NightLimit: parseFloat(d["NightLimit (Db)"] || d.NightLimit || 0),
        }));

        setData(normalized);
        const uniqueStations = [...new Set(normalized.map((d) => d.Station))];
        setStations(uniqueStations);
      })
      .catch((err) => console.error("Error fetching noise data:", err));
  }, []);

  const filteredData = data.filter((d) => d.Station === selectedStation);

  useEffect(() => {
    if (filteredData.length > 0) {
      const first = filteredData[0];
      const last = filteredData[filteredData.length - 1];

      const firstAvg = (first.Day + first.Night) / 2;
      const lastAvg = (last.Day + last.Night) / 2;
      const diff = lastAvg - firstAvg;
      const pctChange = ((diff / firstAvg) * 100).toFixed(2);

      const growthPerYear = diff / (filteredData.length - 1);
      const predicted = lastAvg + growthPerYear;

      const dayGap = last.Day - last.DayLimit;
      const nightGap = last.Night - last.NightLimit;

      setSummary({
        firstYear: first.Year,
        firstAvg,
        lastYear: last.Year,
        lastAvg,
        pctChange,
        predicted: predicted.toFixed(2),
        dayGap,
        nightGap,
        lastDay: last.Day,
        lastNight: last.Night,
        lastDayLimit: last.DayLimit,
        lastNightLimit: last.NightLimit,
      });

      setTimeout(() => {
        detailsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [selectedStation]);

  return (
    <>
      <Navbar />
      <div className="noise-container">
        <h2>🔊 Noise Pollution Trends in Indian Cities</h2>

        <p className="description">
          Noise pollution is one of the most harmful yet overlooked forms of
          environmental pollution. Prolonged exposure to high noise levels can
          cause stress, sleep disturbances, and long-term hearing problems. The
          charts below show the historical day and night noise levels across
          Indian cities compared against permissible limits.
        </p>

        <div className="dropdown">
          <label>Select City: </label>
          <select
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
          >
            <option value="">-- Select a City --</option>
            {stations.map((station) => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>
        </div>

        {selectedStation && summary && (
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
                  <Line
                    type="monotone"
                    dataKey="Day"
                    stroke="#ffc107"
                    name="Day dB"
                  />
                  <Line
                    type="monotone"
                    dataKey="Night"
                    stroke="#03a9f4"
                    name="Night dB"
                  />
                  <Line
                    type="monotone"
                    dataKey="DayLimit"
                    stroke="#4caf50"
                    name="Day Limit"
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="monotone"
                    dataKey="NightLimit"
                    stroke="#f44336"
                    name="Night Limit"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Stats Summary */}
            <div className="summary">
              <h2>📊 Noise Level Summary</h2>
              <p>
                In <strong>{summary.firstYear}</strong>, the average noise level
                was <strong>{summary.firstAvg.toFixed(2)} dB</strong>. By{" "}
                <strong>{summary.lastYear}</strong>, it increased to{" "}
                <strong>{summary.lastAvg.toFixed(2)} dB</strong>.
              </p>
              <p>
                This is a <strong>{summary.pctChange}%</strong>{" "}
                {summary.lastAvg > summary.firstAvg ? "increase" : "decrease"}.
              </p>
              <p>
                If the current trend continues, by{" "}
                <strong>{parseInt(summary.lastYear) + 1}</strong> the average
                level may reach around <strong>{summary.predicted} dB</strong>.
              </p>
            </div>

            {/* Precautionary Steps */}
            <div className="precautions">
              <h2>🛡️ Precautionary Measures</h2>
              <ul>{getPrecautions(summary)}</ul>
            </div>

            {/* Mini Comparison Bar Chart */}
            <div className="gap-chart">
              <h2>📉 Exceedance of Limits in {summary.lastYear}</h2>
              <ResponsiveContainer width="70%" height={250}>
                <BarChart
                  data={[
                    {
                      name: "Day Level",
                      value: summary.lastDay,
                      limit: summary.lastDayLimit,
                    },
                    {
                      name: "Night Level",
                      value: summary.lastNight,
                      limit: summary.lastNightLimit,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8ab4f8" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="limit" fill="#4caf50" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p style={{ marginTop: "10px" }}>
                Day exceedance: <strong>{summary.dayGap.toFixed(2)} dB</strong>{" "}
                | Night exceedance:{" "}
                <strong>{summary.nightGap.toFixed(2)} dB</strong>
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Precaution logic
function getPrecautions(summary) {
  if (!summary) return null;

  const { lastAvg, dayGap, nightGap, pctChange } = summary;
  const tips = [];

  if (lastAvg < 60) {
    tips.push("✅ Noise levels are within safe limits.");
    tips.push("Encourage public to avoid unnecessary honking.");
    tips.push("Maintain community awareness programs.");
  } else if (lastAvg < 70) {
    tips.push("⚠️ Noise levels are moderately high.");
    tips.push("Limit time spent in high-traffic areas.");
    tips.push("Use noise-cancelling headphones if disturbed.");
    tips.push("Promote stricter regulation of construction noise.");
    tips.push("Encourage quieter alternatives in urban transport.");
  } else {
    tips.push("🚨 High noise levels may be hazardous.");
    tips.push("Avoid long stays in noisy areas.");
    tips.push("Use earplugs or keep windows closed.");
    tips.push("Strengthen noise regulations enforcement.");
    tips.push("Promote urban soundproofing initiatives.");
    tips.push("Raise awareness about long-term health effects.");
  }

  if (dayGap > 0 || nightGap > 0) {
    tips.push("⚠️ Noise levels exceed permissible legal limits.");
  }
  if (parseFloat(pctChange) > 20) {
    tips.push("📈 Rapid growth detected – urgent mitigation required.");
  }

  return tips.map((t, i) => <li key={i}>{t}</li>);
}

export default CheckNoisePollution;
