// src/components/upload/FileUploadZone.js
"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";

const FileUploadZone = ({ onFileUpload, isUploading }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0].code === "file-invalid-type") {
          setError("Invalid file type. Please upload PDF, DOCX, or TXT files.");
        } else if (rejection.errors[0].code === "file-too-large") {
          setError("File is too large. Maximum size is 5MB.");
        }
        return;
      }

      const selectedFile = acceptedFiles[0];
      if (selectedFile) {
        const validTypes = [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "text/plain",
        ];

        if (!validTypes.includes(selectedFile.type)) {
          setError("Invalid file type. Please upload PDF, DOCX, or TXT files.");
          return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
          setError("File is too large. Maximum size is 5MB.");
          return;
        }

        setFile(selectedFile);
        onFileUpload(selectedFile);
      }
    },
    [onFileUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-green-500 bg-green-50"
              : "border-gray-300 hover:border-green-500"
          }
          ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} disabled={isUploading} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-green-600">Drop your file here...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">
              Drag & drop your document here, or click to select
            </p>
            <p className="text-sm text-gray-400">
              Supports PDF, DOCX, TXT (Max 5MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {file && (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">{file.name}</p>
              <p className="text-xs text-green-600">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          {!isUploading && (
            <button
              onClick={removeFile}
              className="p-1 hover:bg-green-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-green-600" />
            </button>
          )}
          {isUploading && (
            <CheckCircle className="h-5 w-5 text-green-600 animate-pulse" />
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;
