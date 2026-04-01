// src/components/analysis/AnalysisDashboard.js
"use client";

import { useState, useRef } from "react";
import ClassificationCard from "./ClassificationCard";
import ReadabilityMetrics from "./ReadabilityMetrics";
import TextViewer from "./TextViewer";
import VocabularyHighlighter from "./VocabularyHighlighter";
import { Download, Share2, FileText, Loader2 } from "lucide-react";
import {
  generatePDFReport,
  generateSimplePDFReport,
} from "@/services/pdfService";

const AnalysisDashboard = ({ analysisData }) => {
  const [activeView, setActiveView] = useState("text");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const reportRef = useRef(null);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    setPdfError(null);

    try {
      // Use the simple PDF generation (faster, more reliable)
      await generateSimplePDFReport(analysisData);

      // Alternative: Use the canvas-based PDF for better formatting
      // await generatePDFReport(analysisData, 'report-content');
    } catch (error) {
      console.error("PDF generation failed:", error);
      setPdfError("Failed to generate PDF. Please try again.");

      // Fallback: try simple PDF if canvas method failed
      try {
        await generateSimplePDFReport(analysisData);
        setPdfError(null);
      } catch (fallbackError) {
        setPdfError("Could not generate PDF. Please try again later.");
      }
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadJSON = () => {
    const report = {
      document: analysisData.document,
      classification: analysisData.classification,
      readability: analysisData.readability,
      vocabulary: analysisData.vocabulary,
      metadata: analysisData.metadata,
      sessionId: analysisData.sessionId,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `educas-report-${analysisData.sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "EduCAS Analysis Report",
          text: `Analysis results for ${analysisData.document.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden report content for PDF generation (optional) */}
      <div id="report-content" ref={reportRef} className="hidden">
        {/* This content can be used for canvas-based PDF generation */}
        <div className="p-8">
          <h1 className="text-2xl font-bold">EduCAS Analysis Report</h1>
          <h2 className="text-xl">{analysisData.document.name}</h2>
          {/* Add more structured content here */}
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
          <p className="text-gray-600 text-sm mt-1">
            Session ID: {analysisData.sessionId}
          </p>
        </div>
        <div className="flex space-x-3 flex-wrap gap-2">
          {/* PDF Download Button */}
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Download PDF Report
              </>
            )}
          </button>

          {/* JSON Download Button */}
          <button
            onClick={handleDownloadJSON}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Download JSON
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </button>
        </div>
      </div>

      {/* PDF Error Message */}
      {pdfError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{pdfError}</p>
        </div>
      )}

      {/* View Toggle */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveView("text")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeView === "text"
              ? "text-green-700 border-b-2 border-green-700"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Text Analysis
        </button>
        <button
          onClick={() => setActiveView("vocabulary")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeView === "vocabulary"
              ? "text-green-700 border-b-2 border-green-700"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Vocabulary Analysis
        </button>
      </div>

      {/* Classification and Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ClassificationCard data={analysisData.classification} />
        </div>
        <div className="lg:col-span-2">
          <ReadabilityMetrics data={analysisData.readability} />
        </div>
      </div>

      {/* Text Viewer */}
      {activeView === "text" && (
        <div className="card">
          <TextViewer
            text={analysisData.document.text}
            highlights={analysisData.highlights}
          />
        </div>
      )}

      {/* Vocabulary Analysis */}
      {activeView === "vocabulary" && (
        <div className="card">
          <VocabularyHighlighter
            text={analysisData.document.text}
            domainTerms={analysisData.vocabulary.domainTerms}
            complexTerms={analysisData.vocabulary.complexTerms}
          />
        </div>
      )}

      {/* Statistics Footer */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-xs text-gray-500">Word Count</div>
          <div className="text-lg font-semibold text-gray-900">
            {analysisData.metadata.wordCount.toLocaleString()}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Characters</div>
          <div className="text-lg font-semibold text-gray-900">
            {analysisData.metadata.characterCount.toLocaleString()}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Sentences</div>
          <div className="text-lg font-semibold text-gray-900">
            {analysisData.metadata.sentenceCount}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Avg Word Length</div>
          <div className="text-lg font-semibold text-gray-900">
            {analysisData.metadata.avgWordLength}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Processing Time</div>
          <div className="text-lg font-semibold text-gray-900">
            {(analysisData.metadata.processingTime / 1000).toFixed(1)}s
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
