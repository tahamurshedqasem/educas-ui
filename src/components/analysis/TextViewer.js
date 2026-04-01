// src/components/analysis/TextViewer.js
"use client";

import { useState } from "react";
import { Eye, Highlighter } from "lucide-react";

const TextViewer = ({ text, highlights }) => {
  const [showHighlights, setShowHighlights] = useState(true);

  const renderHighlightedText = () => {
    if (!showHighlights || !highlights) return text;

    let result = text;
    // Sort highlights by length descending to avoid overlapping issues
    const sortedHighlights = [...highlights].sort(
      (a, b) => b.text.length - a.text.length,
    );

    sortedHighlights.forEach((highlight) => {
      const regex = new RegExp(
        `(${highlight.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
        "gi",
      );
      const colorClass =
        highlight.type === "complex" ? "bg-yellow-200" : "bg-orange-200";
      result = result.replace(
        regex,
        `<mark class="${colorClass} px-0.5 rounded">$1</mark>`,
      );
    });

    return result;
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Eye className="h-4 w-4 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Document Text</h3>
        </div>
        <button
          onClick={() => setShowHighlights(!showHighlights)}
          className={`inline-flex items-center px-3 py-1 text-sm rounded-lg transition-colors ${
            showHighlights
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          <Highlighter className="h-3 w-3 mr-1" />
          {showHighlights ? "Hide Highlights" : "Show Highlights"}
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
        {showHighlights ? (
          <div
            className="prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: renderHighlightedText() }}
          />
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap">{text}</p>
        )}
      </div>

      <div className="flex space-x-4 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-yellow-200 rounded"></div>
          <span>Complex Sentences</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-orange-200 rounded"></div>
          <span>Domain-Specific Vocabulary</span>
        </div>
      </div>
    </div>
  );
};

export default TextViewer;
