// src/app/page.js
"use client";

import Link from "next/link";
import { Upload, Brain, BarChart3, Shield, Zap, BookOpen } from "lucide-react";

import Footer from "@/components/layout/Footer";

export default function HomePage() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description:
        "Advanced NLP algorithms understand educational context and provide intelligent insights.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: BarChart3,
      title: "Subject-Adaptive Scoring",
      description:
        "Readability metrics tailored to specific subjects like STEM, Humanities, and Social Sciences.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Zap,
      title: "Fast Processing",
      description:
        "Get comprehensive analysis in under 60 seconds for documents up to 10 pages.",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description:
        "24-hour data retention policy ensures your documents are automatically deleted.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Upload,
      title: "Multiple Formats",
      description:
        "Support for PDF, DOCX, and TXT files with drag-and-drop functionality.",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: BookOpen,
      title: "Educational Focus",
      description:
        "Specifically designed for educators, curriculum developers, and instructional designers.",
      color: "bg-indigo-100 text-indigo-600",
    },
  ];

  return (
    <>
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-50 to-blue-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Educational Content
              <span className="text-green-700"> Analysis System</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform how you evaluate educational materials with AI-powered,
              subject-adaptive intelligence. Upload any document and get
              instant, context-aware analysis.
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-105"
            >
              <Upload className="mr-2 h-5 w-5" />
              Start Analyzing Now
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose EduCAS?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className="card hover:shadow-xl transition-shadow duration-300"
                  >
                    <div
                      className={`inline-flex p-3 rounded-lg ${feature.color} mb-4`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-green-700 mb-2">
                  &lt;60s
                </div>
                <div className="text-gray-600">Average Analysis Time</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-700 mb-2">
                  100%
                </div>
                <div className="text-gray-600">Data Privacy Guarantee</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-700 mb-2">3+</div>
                <div className="text-gray-600">Document Formats Supported</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
