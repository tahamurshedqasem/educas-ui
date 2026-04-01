// src/components/upload/TextInputForm.js
"use client";

import { useState } from "react";
import { Send, AlertCircle } from "lucide-react";

const TextInputForm = ({ onTextSubmit, isProcessing }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("Please enter some text to analyze.");
      return;
    }

    if (text.length > 10000) {
      setError("Text is too long. Maximum 10,000 characters.");
      return;
    }

    setError("");
    onTextSubmit(text);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Text to Analyze
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isProcessing}
          rows={8}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y"
          placeholder="Paste your educational content here for analysis..."
        />
        <p className="text-xs text-gray-500 mt-1">Maximum 10,000 characters</p>
      </div>

      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isProcessing || !text.trim()}
        className="inline-flex items-center px-6 py-2 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="mr-2 h-4 w-4" />
        {isProcessing ? "Processing..." : "Analyze Text"}
      </button>
    </form>
  );
};

export default TextInputForm;
