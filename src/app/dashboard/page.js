
"use client";

import { useEffect, useState } from "react";
import { FaHistory, FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token"); // get token
        if (!token) {
          console.error("No auth token found in localStorage");
          setLoading(false);
          return;
        }

        const res = await fetch("http://127.0.0.1:8000/api/history", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // send token
          },
        });

        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        setHistory(data.history || []);
      } catch (err) {
        console.error("Error loading history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);


  // Clear history in backend
  const clearHistory = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/history", {
        method: "DELETE",
      });
      if (res.ok) {
        setHistory([]);
      }
    } catch (err) {
      console.error("Error clearing history:", err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl p-8 border border-gray-200"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <FaHistory /> Symptom History
          </h2>

          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
            >
              <FaTrashAlt /> Clear All
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-gray-500">Loading history...</p>
        ) : history.length === 0 ? (
          <p className="text-gray-500">
            No history found yet. Try using the predict page first.
          </p>
        ) : (
          <div className="space-y-6">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4"
              >
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Symptoms:</strong> {item.symptoms}
                </p>
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4"
                  >
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Symptoms:</strong> {item.symptoms}
                    </p>

                    <div className="space-y-4">
                      {item.predictions.map((pred, i) => (
                        <div
                          key={i}
                          className="bg-white border rounded-lg p-3 shadow-sm"
                        >
                          <p className="text-sm font-semibold text-blue-700">
                            Diagnosis: {pred.diagnosis}{" "}
                            <span className="text-gray-500">
                              ({Math.round(pred.confidence * 100)}% confidence)
                            </span>
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {pred.description}
                          </p>
                          <p className="text-xs text-gray-700 mt-1">
                            <strong>Medications:</strong> {pred.medications}
                          </p>
                          <p className="text-xs text-gray-700 mt-1">
                            <strong>Diet:</strong> {pred.diet}
                          </p>
                          <p className="text-xs text-gray-700 mt-1">
                            <strong>Precautions:</strong> {pred.precautions}
                          </p>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-gray-400 mt-2">
                      Recorded at: {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}

                <div className="space-y-4">
                  {item.predictions.map((pred, i) => (
                    <div
                      key={i}
                      className="bg-white border rounded-lg p-3 shadow-sm"
                    >
                      <p className="text-sm font-semibold text-blue-700">
                        Diagnosis: {pred.diagnosis}{" "}
                        <span className="text-gray-500">
                          ({Math.round(pred.confidence * 100)}% confidence)
                        </span>
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {pred.description}
                      </p>
                      <p className="text-xs text-gray-700 mt-1">
                        <strong>Medications:</strong> {pred.medications}
                      </p>
                      <p className="text-xs text-gray-700 mt-1">
                        <strong>Diet:</strong> {pred.diet}
                      </p>
                      <p className="text-xs text-gray-700 mt-1">
                        <strong>Precautions:</strong> {pred.precautions}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  Recorded at: {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}
