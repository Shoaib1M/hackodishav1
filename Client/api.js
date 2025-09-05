import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // later use process.env.VITE_API_BASE
});

export default api;
