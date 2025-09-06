import axios from "axios";

// const api = axios.create({
// 	baseURL: "http://127.0.0.1:5000",
// });

const api = axios.create({
	baseURL: "http://127.0.0.1:5000",
});
// Function to send audio file to backend
export const analyzeAudio = async (audioFile) => {
	const formData = new FormData();
	formData.append("file", audioFile, audioFile.name || "recording.wav");

	try {
		const response = await api.post("/predict", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return response.data;
	} catch (error) {
		console.error("Error connecting to the analysis service:", error);
		throw new Error("Could not connect to the backend service. Is it running?");
	}
};

export default api;