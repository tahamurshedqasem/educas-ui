// src/components/common/PDFDownloadButton.js
"use client";

import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { generateSimplePDFReport } from "@/services/pdfService";

const PDFDownloadButton = ({ analysisData, className = "" }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      await generateSimplePDFReport(analysisData);
    } catch (err) {
      setError("Failed to generate PDF");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className={`inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isGenerating ? (
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
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default PDFDownloadButton;
