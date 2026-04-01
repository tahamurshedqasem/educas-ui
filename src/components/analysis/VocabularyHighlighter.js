// src/components/analysis/VocabularyHighlighter.js
"use client";

import { useState } from "react";
import { BookOpen, HelpCircle } from "lucide-react";

const VocabularyHighlighter = ({ text, domainTerms, complexTerms }) => {
  const [selectedTerm, setSelectedTerm] = useState(null);

  const allTerms = [
    ...domainTerms.map((t) => ({ ...t, category: "domain" })),
    ...complexTerms.map((t) => ({ ...t, category: "complex" })),
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Vocabulary Analysis</h3>
        </div>
        <div className="flex space-x-3 text-xs">
          <span className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-200 rounded"></div>
            <span>Domain-Specific Terms</span>
          </span>
          <span className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-200 rounded"></div>
            <span>Complex Terms</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Domain Terms */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Domain-Specific Terminology
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {domainTerms.map((term, idx) => (
              <div
                key={idx}
                className="p-2 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                onClick={() =>
                  setSelectedTerm(selectedTerm === term ? null : term)
                }
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">{term.word}</span>
                  <span className="text-xs text-green-600">
                    Appears {term.count} times
                  </span>
                </div>
                {selectedTerm === term && (
                  <p className="text-xs text-gray-600 mt-1">
                    {term.definition ||
                      "Domain-specific term appropriate for this subject area."}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Complex Terms */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
            Potentially Complex Terms
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {complexTerms.map((term, idx) => (
              <div
                key={idx}
                className="p-2 bg-yellow-50 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors"
                onClick={() =>
                  setSelectedTerm(selectedTerm === term ? null : term)
                }
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">{term.word}</span>
                  <span className="text-xs text-yellow-600">
                    Appears {term.count} times
                  </span>
                </div>
                {selectedTerm === term && (
                  <div className="text-xs text-gray-600 mt-1 space-y-1">
                    <p>Complexity Score: {term.complexityScore}/10</p>
                    <p className="text-gray-500">
                      {term.suggestion ||
                        "Consider simplifying or providing definition."}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <HelpCircle className="h-4 w-4 text-gray-500 mt-0.5" />
          <p className="text-xs text-gray-600">
            Click on any term to see more details. Domain-specific terms are
            appropriate for the detected subject area, while complex terms may
            need simplification for target audience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VocabularyHighlighter;
