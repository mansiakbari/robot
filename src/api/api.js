import axios from "axios";

export const getApiCallback = async (url) => {
  return await axios.get(url);
};

export const postApiCallback = async (url, data) => {
  return await axios.post(url, data);
};

export const putApiCallback = async (url, data) => {
  return await axios.put(url, data);
};

export const API_BASE_URL = process.env.REACT_APP_API_ENDPOINT || "http://10.1.0.1:8080/human_itl";
export const GET_CHECKPOINT_URL = `${API_BASE_URL}/checkpoint`;
export const GET_ANALYSIS_URL = `${API_BASE_URL}/analysis`;

export const setCheckpointUrl = (id) =>
  `${API_BASE_URL}/analysis/measurement/${id}`;
export const getAnalysisResultUrl = (id) =>
  `${API_BASE_URL}/analysis/measurement/${id}/result`;
export const dismissAnalysisUrl = (id) =>
  `${API_BASE_URL}/analysis/${id}`;
