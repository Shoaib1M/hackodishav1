# HackOdishaV1

A full-stack pollution analysis and reporting platform built with Node.js, React, and Python microservices for ML-powered audio and image classification.

---

## 🗂️ Project Structure

```
hackodishav1-main/
│
├── Client/                  # Frontend (React + Vite)
│
├── Server/                  # Backend (Node.js/Express)
│   ├── index.js
│   ├── .env
│   ├── models/
│   ├── land_waste_india.csv
│   ├── noise_pollution_india.csv
│   ├── noicelens_ml-service/   # ML microservice (audio classification, Flask)
│   └── waste_ml-service/       # ML microservice (waste image classification, Flask)
```

---

## 🚀 Features

- **City Pollution Analysis:** View air, land, and noise pollution data for Indian cities.
- **Audio Classification:** Classify noise pollution from audio samples using ML.
- **Image Classification:** Detect waste in images using YOLO-based ML models.
- **Modern UI:** Responsive React frontend.

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express
- **ML Microservices:** Python, Flask, Ultralytics YOLO, OpenCV
- **Deployment:** Render

---

## ⚡ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/hackodishav1.git
cd hackodishav1-main
```

### 2. Setup the Backend

```bash
cd Server
npm install
# Copy .env.example to .env and fill in required values
node index.js
```

### 3. Setup the Frontend

```bash
cd ../Client
npm install
npm run dev
```

### 4. Run ML Microservices

#### Waste Image Classifier

```bash
cd ../Server/waste_ml-service
pip install -r requirements.txt
python app.py
```

#### Noise Audio Classifier

```bash
cd ../Server/noicelens_ml-service
pip install -r noicelens_ml-servicerequirements.txt
python app.py
```

---

## 🌐 Deployment

- Deploy backend and ML microservices as separate web services on [Render](https://render.com).
- Deploy frontend as a static site on Render.
- Update API URLs in frontend to point to deployed backend/microservice URLs.

---

## 📁 Environment Variables

- **Backend:** See `Server/.env.example` for required variables.
- **Frontend:** See `Client/pages/CheckCity/.env` for frontend API keys.
- **ML Services:** No environment variables required by default.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📜 License

[MIT](LICENSE)

---

## 🙏 Acknowledgements

- [Ultralytics YOLO](https://github.com/ultralytics/ultralytics)
