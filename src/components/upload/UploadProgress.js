// src/components/upload/UploadProgress.js
"use client";

import { Loader2 } from "lucide-react";

const UploadProgress = ({ progress, stage }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">{stage}</span>
        <span className="font-medium text-green-700">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-green-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {progress < 100 && (
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Processing... This may take up to 60 seconds</span>
        </div>
      )}
    </div>
  );
};

export default UploadProgress;
