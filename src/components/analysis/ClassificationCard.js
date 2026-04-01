// src/components/analysis/ClassificationCard.js
"use client";

import { Brain, ChevronRight } from "lucide-react";

const ClassificationCard = ({ data }) => {
  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="h-5 w-5 text-purple-600" />
        <h3 className="font-semibold text-gray-900">AI Classification</h3>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-500 mb-1">Primary Domain</div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">
              {data.primaryDomain}
            </span>
            <span
              className={`text-sm font-medium ${getConfidenceColor(data.confidence)}`}
            >
              {data.confidence}% confidence
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${data.confidence}%` }}
            />
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-1">Secondary Subject</div>
          <div className="text-md font-medium text-gray-800">
            {data.secondarySubject}
          </div>
        </div>

        {data.specializedTopics && data.specializedTopics.length > 0 && (
          <div>
            <div className="text-sm text-gray-500 mb-2">Specialized Topics</div>
            <div className="flex flex-wrap gap-2">
              {data.specializedTopics.map((topic, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Classification Method</span>
            <span className="text-gray-700">Transformer-based AI</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-500">Model Version</span>
            <span className="text-gray-700">DistilBERT-base</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassificationCard;
