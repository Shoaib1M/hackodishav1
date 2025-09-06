import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import csv from "csv-parser";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const API_KEY =
  process.env.WAQI_TOKEN || "d590c44ddff6390902a11009e9f9abb08dc18a5c";

// ✅ Root route
app.get("/", (req, res) => {
  res.send("<h1>API Server is running</h1><p>Try accessing /api/noise</p>");
});

// Bounding boxes
const countryBounds = {
  India: [6.7, 68.1, 35.5, 97.4],
  USA: [24.5, -125, 49.5, -66],
  China: [18, 73, 53, 135],
};

// ✅ Get list of stations (cities) for a given country
app.get("/api/countries/:country", async (req, res) => {
  try {
    const country = req.params.country;
    const bounds = countryBounds[country];

    if (!bounds) {
      return res.status(400).json({ error: "Country not supported yet" });
    }

    const url = `https://api.waqi.info/map/bounds/?latlng=${bounds.join(
      ","
    )}&token=${API_KEY}`;

    console.log("🌍 Fetching WAQI URL:", url);

    const response = await fetch(url);
    const data = await response.json();

    if (!data || data.status !== "ok") {
      console.error("❌ Bad WAQI response:", data);
      return res
        .status(500)
        .json({ error: "Failed to fetch stations", detail: data });
    }

    const cities = data.data.map((s) => ({
      uid: s.uid,
      name: s.station.name,
      lat: s.lat,
      lon: s.lon,
      aqi: s.aqi,
    }));

    res.json({ country, cities });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get AQI details for a station UID
app.get("/api/station/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const url = `https://api.waqi.info/feed/@${uid}/?token=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data || data.status !== "ok") {
      return res
        .status(500)
        .json({ error: "Failed to fetch AQI", detail: data });
    }

    res.json(data.data);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Noise Pollution Data (from CSV)
app.get("/api/noise", (req, res) => {
  const results = [];
  const csvPath = path.join(__dirname, "noise_pollution_india.csv");

  const stream = fs.createReadStream(csvPath);

  // CRITICAL: Handle errors, like "file not found"
  stream.on("error", (error) => {
    console.error("Error reading CSV file:", error);
    res.status(500).json({ error: "Could not read noise pollution data." });
  });

  stream
    .pipe(
      csv({
        separator: "\t",
        mapHeaders: ({ header }) => header.trim(),
      })
    )
    .on("error", (error) => {
      console.error("Error processing CSV data:", error);
      if (!res.headersSent) {
        res.status(500).json({
          error: "Could not process noise pollution data.",
          details: error.message,
        });
      }
    })
    .on("data", (row) => {
      if (row.Station && row.Station.trim()) {
        results.push({
          Station: row.Station.trim(),
          Year: +row.Year,
          Day: +row["Day (Db)"],
          Night: +row["Night (Db)"],
          DayLimit: +row["DayLimit (Db)"],
          NightLimit: +row["NightLimit (Db)"],
        });
      }
    })
    .on("end", () => {
      res.json(results);
    });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
