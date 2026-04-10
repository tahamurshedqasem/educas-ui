"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  File,
  FileArchive,
  FileJson,
  FileCode,
  Globe,
} from "lucide-react";

export default function UploadPage() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputMethod, setInputMethod] = useState("text"); // 'text' or 'file'
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const API_URL = "http://localhost:5000/api";

  const getToken = () => {
    return localStorage.getItem("educas_token");
  };

  // Handle text submission
  const handleTextSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter some text to analyze");
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);

      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ text }),
      });

      clearInterval(interval);
      setUploadProgress(100);

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // Redirect to result page
      setTimeout(() => {
        router.push(`/results/${data.session_id}`);
      }, 500);
    } catch (err) {
      alert(err.message);
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle file submission
  const handleFileSubmit = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("file", file);

      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const res = await fetch(`${API_URL}/analyze/file`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      clearInterval(interval);
      setUploadProgress(100);

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // Redirect to result page
      setTimeout(() => {
        router.push(`/results/${data.session_id}`);
      }, 500);
    } catch (err) {
      alert(err.message);
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  // Validate file type and size
  const validateAndSetFile = (selectedFile) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/markdown",
      "application/rtf",
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (
      !allowedTypes.includes(selectedFile.type) &&
      !selectedFile.name.match(/\.(pdf|doc|docx|txt|md|rtf)$/i)
    ) {
      alert("Please upload a valid file (PDF, DOC, DOCX, TXT, MD, or RTF)");
      return false;
    }

    if (selectedFile.size > maxSize) {
      alert("File size must be less than 10MB");
      return false;
    }

    setFile(selectedFile);
    return true;
  };

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
      setInputMethod("file");
    }
  }, []);

  // Clear file
  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Get file icon based on type
  const getFileIcon = (fileName) => {
    if (fileName.match(/\.pdf$/i))
      return <File className="w-8 h-8 text-red-500" />;
    if (fileName.match(/\.docx?$/i))
      return <FileText className="w-8 h-8 text-blue-500" />;
    if (fileName.match(/\.txt$/i))
      return <FileCode className="w-8 h-8 text-green-500" />;
    if (fileName.match(/\.md$/i))
      return <FileCode className="w-8 h-8 text-purple-500" />;
    return <FileArchive className="w-8 h-8 text-gray-500" />;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg mb-4">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Document Analysis
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Upload a document or paste text for AI-powered analysis. Get
            insights about readability, classification, and content structure.
          </p>
        </div>

        {/* Method Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-6 flex gap-1">
          <button
            onClick={() => setInputMethod("text")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              inputMethod === "text"
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Paste Text
          </button>
          <button
            onClick={() => setInputMethod("file")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              inputMethod === "file"
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Upload File
          </button>
        </div>

        {/* Text Input Area */}
        {inputMethod === "text" && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter Text for Analysis
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-y"
                rows={10}
                placeholder="Paste your text here...&#10;&#10;Example:&#10;Quantum computing is a type of computation that harnesses the collective properties of quantum states, such as superposition, interference, and entanglement, to perform calculations. Unlike classical computers that use bits (0s and 1s), quantum computers use quantum bits or qubits..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="mt-3 flex justify-between items-center text-sm text-gray-500">
                <span>
                  📝 {text.split(/\s+/).filter((w) => w.length > 0).length}{" "}
                  words
                </span>
                <span>🔤 {text.length} characters</span>
              </div>
            </div>
          </div>
        )}

        {/* File Upload Area */}
        {inputMethod === "file" && (
          <div className="space-y-4">
            {/* Drag & Drop Zone */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/30"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.txt,.md,.rtf"
                className="hidden"
                id="file-upload"
              />

              <label
                htmlFor="file-upload"
                className="cursor-pointer block text-center"
              >
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-10 h-10 text-blue-500" />
                  </div>
                  <p className="text-lg font-semibold text-gray-700 mb-2">
                    Drop your file here or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supports PDF, DOC, DOCX, TXT, MD (Max 10MB)
                  </p>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition"
                  >
                    Choose File
                  </button>
                </div>
              </label>
            </div>

            {/* File Preview */}
            {file && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getFileIcon(file.name)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {file.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)} •{" "}
                        {file.type || "Unknown type"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearFile}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="mt-3 flex gap-4 text-sm text-gray-600">
                  <span>✅ File validated</span>
                  <span>📄 Ready for analysis</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Progress Bar */}
        {loading && (
          <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                <span className="font-medium text-gray-700">
                  Processing your document...
                </span>
              </div>
              <span className="text-sm font-semibold text-blue-600">
                {uploadProgress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              {uploadProgress < 30 && "📝 Preparing analysis..."}
              {uploadProgress >= 30 &&
                uploadProgress < 60 &&
                "🤖 AI is analyzing content..."}
              {uploadProgress >= 60 &&
                uploadProgress < 100 &&
                "📊 Generating insights..."}
              {uploadProgress === 100 && "✅ Complete! Redirecting..."}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {!loading && (
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={
                inputMethod === "text" ? handleTextSubmit : handleFileSubmit
              }
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
            >
              {inputMethod === "text" ? "Analyze Text" : "Upload & Analyze"}
            </button>

            {inputMethod === "text" && text && (
              <button
                onClick={() => setText("")}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Clear Text
              </button>
            )}
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-5 border border-gray-200 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Multi-Format Support
            </h3>
            <p className="text-sm text-gray-600">
              PDF, DOC, DOCX, TXT, and more
            </p>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              AI-Powered Analysis
            </h3>
            <p className="text-sm text-gray-600">
              Smart classification & readability metrics
            </p>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Instant Results
            </h3>
            <p className="text-sm text-gray-600">
              Get detailed analysis in seconds
            </p>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-5 border border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Pro Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • For best results, ensure your text is at least 100 words
                  long
                </li>
                <li>
                  • PDF and DOCX files preserve structural formatting for better
                  analysis
                </li>
                <li>
                  • Maximum file size is 10MB for optimal processing speed
                </li>
                <li>
                  • All data is processed securely and not stored permanently
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slide-in-from-top {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: slide-in-from-top 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
