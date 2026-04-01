// src/services/analysisService.js
import api from "./api";

export const analyzeDocument = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/analyze/document", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const analyzeText = async (text) => {
  const response = await api.post("/analyze/text", { text });
  return response.data;
};

export const getAnalysisResults = async (sessionId) => {
  const response = await api.get(`/results/${sessionId}`);
  return response.data;
};

export const downloadReport = async (sessionId, format = "json") => {
  const response = await api.get(`/results/${sessionId}/download`, {
    params: { format },
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `educas-report-${sessionId}.${format}`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
