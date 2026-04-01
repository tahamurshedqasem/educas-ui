// src/components/analysis/ReadabilityMetrics.js
"use client";

import { BarChart3, TrendingUp, BookOpen } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const ReadabilityMetrics = ({ data }) => {
  const metrics = [
    {
      name: "Flesch-Kincaid",
      value: data.fleschKincaid,
      benchmark: data.benchmark.fleschKincaid,
    },
    { name: "SMOG Index", value: data.smog, benchmark: data.benchmark.smog },
    {
      name: "Gunning Fog",
      value: data.gunningFog,
      benchmark: data.benchmark.gunningFog,
    },
    {
      name: "Coleman-Liau",
      value: data.colemanLiau,
      benchmark: data.benchmark.colemanLiau,
    },
  ];

  const getStatusColor = (value, benchmark) => {
    if (value <= benchmark) return "text-green-600";
    if (value <= benchmark * 1.2) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusIcon = (value, benchmark) => {
    if (value <= benchmark) return "✓";
    if (value <= benchmark * 1.2) return "!";
    return "⚠";
  };

  const pieData = [
    { name: "Standard", value: data.wordComplexity.standard, color: "#4CAF50" },
    {
      name: "Domain-Specific",
      value: data.wordComplexity.domainSpecific,
      color: "#FFC107",
    },
    { name: "Complex", value: data.wordComplexity.complex, color: "#F44336" },
  ];

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <BarChart3 className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">Readability Metrics</h3>
        <span className="text-xs text-gray-400 ml-auto">
          Subject-Adaptive: {data.subjectContext}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Metrics Table */}
        <div className="space-y-3">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{metric.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-900">
                  {metric.value.toFixed(1)}
                </span>
                <span className="text-xs text-gray-400">
                  (Benchmark: {metric.benchmark})
                </span>
                <span
                  className={`text-sm font-bold ${getStatusColor(metric.value, metric.benchmark)}`}
                >
                  {getStatusIcon(metric.value, metric.benchmark)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Word Complexity Chart */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Word Complexity Distribution
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Context Note */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
          <p className="text-xs text-blue-800">
            These scores have been adjusted for {data.subjectContext} context.
            Technical terms appropriate for this subject are not counted as
            complex vocabulary.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReadabilityMetrics;
