// src/app/upload/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FileUploadZone from "@/components/upload/FileUploadZone";
import TextInputForm from "@/components/upload/TextInputForm";
import UploadProgress from "@/components/upload/UploadProgress";
import { generateMockAnalysisResult } from "@/services/mockData";

export default function UploadPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("file");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStage, setProgressStage] = useState("");

  const handleFileUpload = async (file) => {
    setIsProcessing(true);
    setProgress(0);
    setProgressStage("Uploading file...");

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 1000);

      // Simulate API delay with mock data
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Generate mock result based on file name
      const mockResult = generateMockAnalysisResult(file.name);

      clearInterval(progressInterval);
      setProgress(100);
      setProgressStage("Analysis complete!");

      // Store mock result in localStorage for results page
      localStorage.setItem(
        `analysis_${mockResult.sessionId}`,
        JSON.stringify(mockResult),
      );

      // Navigate to results page
      setTimeout(() => {
        router.push(`/results/${mockResult.sessionId}`);
      }, 500);
    } catch (error) {
      console.error("Upload failed:", error);
      setProgressStage("Error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = async (text) => {
    setIsProcessing(true);
    setProgress(0);
    setProgressStage("Processing text...");

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate mock result from text
      const mockResult = generateMockAnalysisResult(
        text.substring(0, 30) + "...",
        text,
      );

      setProgress(100);
      setProgressStage("Analysis complete!");

      // Store mock result in localStorage
      localStorage.setItem(
        `analysis_${mockResult.sessionId}`,
        JSON.stringify(mockResult),
      );

      setTimeout(() => {
        router.push(`/results/${mockResult.sessionId}`);
      }, 500);
    } catch (error) {
      console.error("Analysis failed:", error);
      setProgressStage("Error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Analyze Educational Content
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Upload a document or paste text to get AI-powered analysis
          </p>

          {/* Tab Switcher */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab("file")}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === "file"
                  ? "text-green-700 border-b-2 border-green-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setActiveTab("text")}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === "text"
                  ? "text-green-700 border-b-2 border-green-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Paste Text
            </button>
          </div>

          {/* Content Area */}
          <div className="card">
            {activeTab === "file" ? (
              <FileUploadZone
                onFileUpload={handleFileUpload}
                isUploading={isProcessing}
              />
            ) : (
              <TextInputForm
                onTextSubmit={handleTextSubmit}
                isProcessing={isProcessing}
              />
            )}

            {isProcessing && (
              <div className="mt-6">
                <UploadProgress progress={progress} stage={progressStage} />
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              What happens next?
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Our AI analyzes your content for subject classification</li>
              <li>
                • Readability scores are calculated with subject-specific
                benchmarks
              </li>
              <li>• Vocabulary complexity is assessed in context</li>
              <li>• Results are displayed in an interactive dashboard</li>
              <li>• Your data is automatically deleted after 24 hours</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
