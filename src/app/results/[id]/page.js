// src/app/results/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnalysisDashboard from "@/components/analysis/AnalysisDashboard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { getMockAnalysisResult } from "@/services/mockData";

export default function ResultsPage() {
  const params = useParams();
  const sessionId = params.id;

  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Get mock data
        const data = getMockAnalysisResult(sessionId);
        setAnalysisData(data);
      } catch (err) {
        setError(err.message || "Failed to load analysis results");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchResults();
    }
  }, [sessionId]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <LoadingSpinner text="Loading analysis results..." />
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="card text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => (window.location.href = "/upload")}
              className="mt-4 btn-primary"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <AnalysisDashboard analysisData={analysisData} />
      </main>
      <Footer />
    </>
  );
}
