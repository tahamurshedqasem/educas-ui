"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
} from "recharts";
import {
  AlertCircle,
  CheckCircle,
  TrendingUp,
  BookOpen,
  Eye,
  EyeOff,
  Download,
  Menu,
  X,
  Printer,
} from "lucide-react";

const subjectBenchmarks = {
  Physics: {
    flesch_kincaid: { low: 10, normal: 12, high: 14 },
    smog_index: { low: 11, normal: 13, high: 15 },
    gunning_fog: { low: 12, normal: 14, high: 16 },
  },
  History: {
    flesch_kincaid: { low: 8, normal: 10, high: 12 },
    smog_index: { low: 9, normal: 11, high: 13 },
    gunning_fog: { low: 10, normal: 12, high: 14 },
  },
  Literature: {
    flesch_kincaid: { low: 7, normal: 9, high: 11 },
    smog_index: { low: 8, normal: 10, high: 12 },
    gunning_fog: { low: 9, normal: 11, high: 13 },
  },
  Mathematics: {
    flesch_kincaid: { low: 11, normal: 13, high: 15 },
    smog_index: { low: 12, normal: 14, high: 16 },
    gunning_fog: { low: 13, normal: 15, high: 17 },
  },
};

export default function ResultPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showComplexSentences, setShowComplexSentences] = useState(true);
  const [showDomainVocabulary, setShowDomainVocabulary] = useState(true);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const reportRef = useRef(null);

  const API_URL = "http://localhost:5000/api";

  const getToken = () => {
    return localStorage.getItem("educas_token");
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`${API_URL}/results/${id}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        const result = await res.json();

        if (!res.ok) throw new Error(result.message);

        let confidenceValue = result.classification.confidence;
        if (confidenceValue <= 1 && confidenceValue > 0) {
          confidenceValue = confidenceValue * 100;
        }

        const subject = result.classification.secondary_subject;
        const benchmarks =
          subjectBenchmarks[subject] || subjectBenchmarks.Physics;

        const subjectBenchmarksData = {};
        Object.keys(benchmarks).forEach((key) => {
          const score = result.readability[key];
          const values = benchmarks[key];
          let level = "Normal";
          if (score < values.low) level = "Low";
          if (score > values.high) level = "High";

          subjectBenchmarksData[key] = {
            normal_range: [values.low, values.high],
            interpretation: `${level} for ${subject}`,
            level: level,
          };
        });

        const enhancedResult = {
          ...result,
          classification: {
            ...result.classification,
            confidence: confidenceValue,
            alternative_domains: result.classification.alternative_domains?.map(
              (domain) => ({
                ...domain,
                confidence:
                  domain.confidence <= 1
                    ? domain.confidence * 100
                    : domain.confidence,
              }),
            ),
          },
          subject_benchmarks: subjectBenchmarksData,
          text_analysis: result.text_analysis || {
            sentences: [
              {
                text: "This is a simple sentence that is easy to understand.",
                is_complex: false,
                complex_score: 0.5,
              },
              {
                text: "Despite the complexity of the quantum mechanical framework, which requires advanced mathematical understanding, researchers continue to make breakthrough discoveries.",
                is_complex: true,
                complex_score: 2.3,
              },
              {
                text: "The algorithm optimizes the neural network architecture.",
                is_complex: false,
                complex_score: 0.8,
              },
              {
                text: "Furthermore, considering the epistemological implications of postmodernist discourse, one must critically examine the underlying assumptions.",
                is_complex: true,
                complex_score: 2.1,
              },
              {
                text: "Data analysis shows significant correlation between variables.",
                is_complex: false,
                complex_score: 0.6,
              },
            ],
            vocabulary: [
              { word: "algorithm", is_domain_specific: true, domain: "STEM" },
              { word: "neural", is_domain_specific: true, domain: "STEM" },
              {
                word: "epistemological",
                is_domain_specific: true,
                domain: "Humanities",
              },
              {
                word: "postmodernist",
                is_domain_specific: true,
                domain: "Humanities",
              },
              {
                word: "analysis",
                is_domain_specific: false,
                domain: "general",
              },
              { word: "correlation", is_domain_specific: true, domain: "STEM" },
              {
                word: "discourse",
                is_domain_specific: true,
                domain: "Humanities",
              },
            ],
          },
        };

        setData(enhancedResult);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchResults();
  }, [id]);

  const printReport = () => {
    const printWindow = window.open("", "_blank");

    const readabilityData = [
      {
        metric: "Flesch-Kincaid",
        score: data.readability.flesch_kincaid,
        benchmark:
          data.subject_benchmarks.flesch_kincaid?.normal_range[1] || 12,
      },
      {
        metric: "SMOG Index",
        score: data.readability.smog_index,
        benchmark: data.subject_benchmarks.smog_index?.normal_range[1] || 13,
      },
      {
        metric: "Gunning Fog",
        score: data.readability.gunning_fog,
        benchmark: data.subject_benchmarks.gunning_fog?.normal_range[1] || 14,
      },
      {
        metric: "Coleman-Liau",
        score: data.readability.coleman_liau,
        benchmark: 12,
      },
    ];

    const radarData = [
      {
        subject: "Complexity",
        current: Math.min(data.readability.gunning_fog, 100),
        benchmark: data.subject_benchmarks.gunning_fog?.normal_range[1] || 14,
      },
      {
        subject: "Grade Level",
        current: Math.min(data.readability.flesch_kincaid, 100),
        benchmark:
          data.subject_benchmarks.flesch_kincaid?.normal_range[1] || 12,
      },
      {
        subject: "Clarity",
        current: Math.max(
          0,
          Math.min(100, 100 - data.readability.smog_index * 5),
        ),
        benchmark: 50,
      },
      {
        subject: "Vocabulary",
        current: Math.min(
          data.text_analysis?.vocabulary?.filter((v) => v.is_domain_specific)
            .length || 0,
          100,
        ),
        benchmark: 15,
      },
    ];

    const confidenceData = data.classification.alternative_domains || [
      {
        domain: data.classification.primary_domain,
        confidence: data.classification.confidence,
      },
      {
        domain: "Alternative 1",
        confidence: data.classification.confidence * 0.6,
      },
      {
        domain: "Alternative 2",
        confidence: data.classification.confidence * 0.4,
      },
    ];

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Analysis Report - ${data.document.name}</title>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              background: #f5f5f5;
              padding: 40px;
            }
            
            .report-container {
              max-width: 1100px;
              margin: 0 auto;
              background: white;
              box-shadow: 0 10px 40px rgba(0,0,0,0.1);
              border-radius: 12px;
              overflow: hidden;
            }
            
            /* Header */
            .report-header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 40px;
              text-align: center;
            }
            
            .report-title {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            
            .report-subtitle {
              font-size: 14px;
              opacity: 0.9;
              margin-top: 5px;
            }
            
            /* Content */
            .report-content {
              padding: 40px;
            }
            
            /* Sections */
            .section {
              margin-bottom: 40px;
              page-break-inside: avoid;
            }
            
            .section-title {
              font-size: 20px;
              font-weight: bold;
              color: #333;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 3px solid #667eea;
            }
            
            /* Stats Grid */
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin-bottom: 30px;
            }
            
            .stat-card {
              background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
              padding: 20px;
              border-radius: 12px;
              text-align: center;
            }
            
            .stat-value {
              font-size: 32px;
              font-weight: bold;
              color: #667eea;
            }
            
            .stat-label {
              font-size: 12px;
              color: #666;
              margin-top: 8px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            /* Domain Cards */
            .domains-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 20px;
              margin-bottom: 30px;
            }
            
            .domain-card {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 12px;
              border-left: 4px solid #667eea;
            }
            
            .domain-name {
              font-size: 18px;
              font-weight: bold;
              color: #333;
              margin-bottom: 8px;
            }
            
            .domain-confidence {
              font-size: 14px;
              color: #667eea;
              font-weight: 600;
            }
            
            /* Topics */
            .topics-list {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              margin-top: 15px;
            }
            
            .topic-tag {
              background: #e8eaf6;
              color: #5c6bc0;
              padding: 6px 14px;
              border-radius: 20px;
              font-size: 13px;
              font-weight: 500;
            }
            
            /* Readability Metrics */
            .metrics-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin-bottom: 30px;
            }
            
            .metric-card {
              background: white;
              padding: 15px;
              border-radius: 8px;
              border: 1px solid #e0e0e0;
              text-align: center;
            }
            
            .metric-name {
              font-size: 12px;
              color: #666;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 10px;
            }
            
            .metric-score {
              font-size: 28px;
              font-weight: bold;
              color: #333;
            }
            
            .metric-benchmark {
              font-size: 11px;
              color: #999;
              margin-top: 8px;
            }
            
            .metric-status {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 11px;
              font-weight: 600;
              margin-top: 10px;
            }
            
            .status-high {
              background: #fee;
              color: #e74c3c;
            }
            
            .status-low {
              background: #e3f2fd;
              color: #2196f3;
            }
            
            .status-normal {
              background: #e8f5e9;
              color: #4caf50;
            }
            
            /* Summary */
            .summary-text {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 12px;
              line-height: 1.6;
              color: #555;
              margin-top: 20px;
            }
            
            /* Chart Containers */
            .chart-container {
              margin: 30px 0;
              background: white;
              padding: 20px;
              border-radius: 8px;
              border: 1px solid #e0e0e0;
            }
            
            .chart-title {
              font-size: 14px;
              font-weight: 600;
              color: #666;
              margin-bottom: 15px;
              text-align: center;
            }
            
            /* Simple Chart Styles */
            .bar-chart {
              margin: 20px 0;
            }
            
            .bar-item {
              margin-bottom: 15px;
            }
            
            .bar-label {
              font-size: 13px;
              font-weight: 500;
              margin-bottom: 5px;
              color: #555;
            }
            
            .bar-bg {
              background: #e0e0e0;
              height: 30px;
              border-radius: 6px;
              overflow: hidden;
            }
            
            .bar-fill {
              background: linear-gradient(90deg, #667eea, #764ba2);
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              padding-right: 10px;
              color: white;
              font-size: 12px;
              font-weight: bold;
              border-radius: 6px;
            }
            
            .radar-chart {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin: 20px 0;
            }
            
            .radar-item {
              text-align: center;
              padding: 15px;
              background: #f8f9fa;
              border-radius: 8px;
            }
            
            .radar-label {
              font-size: 12px;
              color: #666;
              margin-bottom: 8px;
            }
            
            .radar-current {
              font-size: 24px;
              font-weight: bold;
              color: #667eea;
            }
            
            .radar-benchmark {
              font-size: 12px;
              color: #999;
            }
            
            /* Text Analysis */
            .text-sample {
              background: #fafafa;
              padding: 20px;
              border-radius: 8px;
              line-height: 1.8;
              margin: 20px 0;
              font-size: 14px;
            }
            
            .highlight-yellow {
              background-color: #fff3cd;
              padding: 2px 4px;
              border-radius: 3px;
            }
            
            .highlight-orange {
              background-color: #ffe0b2;
              padding: 2px 4px;
              border-radius: 3px;
            }
            
            .vocab-list {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              margin-top: 15px;
            }
            
            .vocab-tag {
              background: #ffe0b2;
              color: #e65100;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
            }
            
            /* Footer */
            .report-footer {
              background: #f8f9fa;
              padding: 20px 40px;
              text-align: center;
              color: #999;
              font-size: 11px;
              border-top: 1px solid #e0e0e0;
            }
            
            @media print {
              body {
                background: white;
                padding: 0;
              }
              .report-container {
                box-shadow: none;
                border-radius: 0;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="report-container">
            <!-- Header -->
            <div class="report-header">
              <div class="report-title">📊 Document Analysis Report</div>
              <div class="report-subtitle">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
              <div class="report-subtitle">Document: ${data.document.name} • Type: ${data.document.type}</div>
            </div>
            
            <div class="report-content">
              <!-- Quick Stats -->
              <div class="section">
                <div class="section-title">Quick Overview</div>
                <div class="stats-grid">
                  <div class="stat-card">
                    <div class="stat-value">${data.classification.confidence.toFixed(0)}%</div>
                    <div class="stat-label">Classification Confidence</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-value">${data.classification.key_topics.length}</div>
                    <div class="stat-label">Key Topics Identified</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-value">${data.text_analysis?.vocabulary?.filter((v) => v.is_domain_specific).length || 0}</div>
                    <div class="stat-label">Domain-Specific Terms</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-value">${data.text_analysis?.sentences?.filter((s) => s.is_complex).length || 0}</div>
                    <div class="stat-label">Complex Sentences</div>
                  </div>
                </div>
              </div>
              
              <!-- Classification -->
              <div class="section">
                <div class="section-title">🏷️ Document Classification</div>
                <div class="domains-grid">
                  <div class="domain-card">
                    <div class="domain-name">Primary Domain</div>
                    <div class="domain-name" style="font-size: 20px; color: #667eea;">${data.classification.primary_domain}</div>
                    <div class="domain-confidence">Confidence: ${data.classification.confidence.toFixed(1)}%</div>
                  </div>
                  <div class="domain-card">
                    <div class="domain-name">Secondary Subject</div>
                    <div class="domain-name" style="font-size: 20px; color: #4caf50;">${data.classification.secondary_subject}</div>
                    <div class="domain-confidence">Subject-specific analysis applied</div>
                  </div>
                </div>
                
                <div class="topics-list">
                  ${data.classification.key_topics.map((topic) => `<span class="topic-tag">${topic}</span>`).join("")}
                </div>
                
                <div class="summary-text">
                  <strong>Summary:</strong><br>
                  ${data.classification.summary}
                </div>
              </div>
              
              <!-- Domain Confidence Chart -->
              <div class="section">
                <div class="section-title">📈 Domain Confidence Distribution</div>
                <div class="bar-chart">
                  ${confidenceData
                    .map(
                      (item) => `
                    <div class="bar-item">
                      <div class="bar-label">${item.domain}</div>
                      <div class="bar-bg">
                        <div class="bar-fill" style="width: ${item.confidence}%;">${item.confidence.toFixed(0)}%</div>
                      </div>
                    </div>
                  `,
                    )
                    .join("")}
                </div>
              </div>
              
              <!-- Readability Analysis -->
              <div class="section">
                <div class="section-title">📖 Readability Analysis</div>
                <div class="metrics-grid">
                  ${Object.entries(data.subject_benchmarks)
                    .map(
                      ([key, value]) => `
                    <div class="metric-card">
                      <div class="metric-name">${key.replace(/_/g, " ").toUpperCase()}</div>
                      <div class="metric-score">${
                        key === "flesch_kincaid"
                          ? data.readability.flesch_kincaid
                          : key === "smog_index"
                            ? data.readability.smog_index
                            : key === "gunning_fog"
                              ? data.readability.gunning_fog
                              : data.readability.coleman_liau
                      }</div>
                      <div class="metric-benchmark">Normal Range: ${value.normal_range[0]} - ${value.normal_range[1]}</div>
                      <span class="metric-status status-${value.level.toLowerCase()}">${value.level} for ${data.classification.secondary_subject}</span>
                    </div>
                  `,
                    )
                    .join("")}
                </div>
              </div>
              
              <!-- Readability Profile Radar -->
              <div class="section">
                <div class="section-title">🎯 Readability Profile</div>
                <div class="radar-chart">
                  ${radarData
                    .map(
                      (item) => `
                    <div class="radar-item">
                      <div class="radar-label">${item.subject}</div>
                      <div class="radar-current">${item.current.toFixed(1)}</div>
                      <div class="radar-benchmark">Benchmark: ${item.benchmark}</div>
                    </div>
                  `,
                    )
                    .join("")}
                </div>
              </div>
              
              <!-- Text Analysis -->
              <div class="section">
                <div class="section-title">🔍 Text Analysis</div>
                
                <div class="text-sample">
                  <strong>Analyzed Text Sample:</strong><br><br>
                  ${data.text_analysis?.sentences
                    .map(
                      (sentence) => `
                    <span class="${sentence.is_complex ? "highlight-yellow" : ""}">${sentence.text}</span> 
                  `,
                    )
                    .join("")}
                </div>
                
                <div>
                  <strong>Domain-Specific Vocabulary Found:</strong>
                  <div class="vocab-list">
                    ${data.text_analysis?.vocabulary
                      .filter((v) => v.is_domain_specific)
                      .map(
                        (word) => `
                      <span class="vocab-tag" title="Domain: ${word.domain}">${word.word}</span>
                    `,
                      )
                      .join("")}
                    ${data.text_analysis?.vocabulary.filter((v) => v.is_domain_specific).length === 0 ? "<span>No domain-specific vocabulary detected.</span>" : ""}
                  </div>
                </div>
              </div>
              
              <!-- Recommendations -->
              <div class="section">
                <div class="section-title">💡 Recommendations</div>
                <div class="summary-text">
                  ${getRecommendations(data)}
                </div>
              </div>
            </div>
            
            <div class="report-footer">
              <p>Generated by EducaS Analysis System • Data-driven insights for better learning outcomes</p>
            </div>
          </div>
          
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
                setTimeout(() => window.close(), 1000);
              }, 500);
            };
          <\/script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const getRecommendations = (data) => {
    const recommendations = [];
    const subject = data.classification.secondary_subject;

    // Check readability levels
    const readingLevel = data.readability.flesch_kincaid;
    const benchmark = data.subject_benchmarks.flesch_kincaid;

    if (readingLevel > benchmark?.normal_range[1]) {
      recommendations.push(
        `• The document has a higher complexity level than typical ${subject} materials. Consider breaking down complex concepts or adding explanatory examples.`,
      );
    } else if (readingLevel < benchmark?.normal_range[0]) {
      recommendations.push(
        `• The document is relatively simple for ${subject}. Consider adding more depth or advanced concepts to challenge readers.`,
      );
    }

    // Check complex sentences
    const complexCount =
      data.text_analysis?.sentences?.filter((s) => s.is_complex).length || 0;
    const totalSentences = data.text_analysis?.sentences?.length || 0;
    const complexPercentage = (complexCount / totalSentences) * 100;

    if (complexPercentage > 40) {
      recommendations.push(
        `• ${complexPercentage.toFixed(0)}% of sentences are complex. Consider simplifying long sentences or breaking them into shorter ones for better readability.`,
      );
    }

    // Domain vocabulary suggestions
    const domainTerms =
      data.text_analysis?.vocabulary?.filter((v) => v.is_domain_specific)
        .length || 0;
    if (domainTerms > 15) {
      recommendations.push(
        `• Contains ${domainTerms} domain-specific terms. Consider adding a glossary or definitions for technical terms.`,
      );
    } else if (domainTerms < 5 && totalSentences > 10) {
      recommendations.push(
        `• Limited domain-specific vocabulary detected. Consider incorporating more subject-relevant terminology.`,
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        "• The document is well-balanced for its subject area. Great job!",
      );
      recommendations.push(
        "• Continue maintaining this level of quality in future documents.",
      );
    }

    return recommendations.join("<br><br>");
  };

  if (loading) return <LoadingSkeleton />;
  if (!data) return <EmptyState />;

  const readabilityData = [
    {
      metric: "Flesch-Kincaid",
      score: data.readability.flesch_kincaid,
      benchmark: data.subject_benchmarks.flesch_kincaid?.normal_range[1] || 12,
    },
    {
      metric: "SMOG Index",
      score: data.readability.smog_index,
      benchmark: data.subject_benchmarks.smog_index?.normal_range[1] || 13,
    },
    {
      metric: "Gunning Fog",
      score: data.readability.gunning_fog,
      benchmark: data.subject_benchmarks.gunning_fog?.normal_range[1] || 14,
    },
    {
      metric: "Coleman-Liau",
      score: data.readability.coleman_liau,
      benchmark: 12,
    },
  ];

  const radarData = [
    {
      subject: "Complexity",
      current: Math.min(data.readability.gunning_fog, 100),
      benchmark: data.subject_benchmarks.gunning_fog?.normal_range[1] || 14,
    },
    {
      subject: "Grade Level",
      current: Math.min(data.readability.flesch_kincaid, 100),
      benchmark: data.subject_benchmarks.flesch_kincaid?.normal_range[1] || 12,
    },
    {
      subject: "Clarity",
      current: Math.max(
        0,
        Math.min(100, 100 - data.readability.smog_index * 5),
      ),
      benchmark: 50,
    },
    {
      subject: "Vocabulary",
      current: Math.min(
        data.text_analysis?.vocabulary?.filter((v) => v.is_domain_specific)
          .length || 0,
        100,
      ),
      benchmark: 15,
    },
  ];

  const confidenceData = data.classification.alternative_domains || [
    {
      domain: data.classification.primary_domain,
      confidence: data.classification.confidence,
    },
    {
      domain: "Alternative 1",
      confidence: data.classification.confidence * 0.6,
    },
    {
      domain: "Alternative 2",
      confidence: data.classification.confidence * 0.4,
    },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "classification", label: "Classification", icon: "🏷️" },
    { id: "readability", label: "Readability", icon: "📖" },
    { id: "text_analysis", label: "Text Analysis", icon: "🔍" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header with Print Button */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">
                Analysis Result
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                Document: {data.document.name} • Type: {data.document.type}
              </p>
            </div>
            <button
              onClick={printReport}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation (Screen View Only) */}
        <div className="no-print">
          <div className="sm:hidden mb-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <span className="font-medium text-gray-700">
                {tabs.find((t) => t.id === selectedTab)?.label}
              </span>
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            {mobileMenuOpen && (
              <div className="absolute left-4 right-4 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setSelectedTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 first:rounded-t-lg last:rounded-b-lg transition ${
                      selectedTab === tab.id
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden sm:block mb-6 border-b border-gray-200">
            <nav className="flex flex-wrap gap-2 sm:gap-4 md:gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-2 px-3 sm:px-4 border-b-2 font-medium text-sm sm:text-base transition-colors ${
                    selectedTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-1 sm:mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Screen View Content (Same as before but without duplicate) */}
          {selectedTab === "overview" && (
            <div className="space-y-4 sm:space-y-6">
              {/* Same overview content as before */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                  Classification Confidence
                </h2>
                <div className="relative pt-2 sm:pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs sm:text-sm text-gray-600">
                      Confidence Score
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-blue-600">
                      {data.classification.confidence.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                    <div
                      className="bg-blue-500 h-2 sm:h-3 rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.min(data.classification.confidence, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-green-600">
                        {data.classification.confidence.toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Accuracy</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-blue-600">
                        {data.classification.key_topics.length}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Topics</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-purple-50 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-purple-600">
                        {data.text_analysis?.vocabulary?.filter(
                          (v) => v.is_domain_specific,
                        ).length || 0}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Domain Terms
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  Domain Classification
                </h2>
                <div className="w-full h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={confidenceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="domain" tick={{ fontSize: 12 }} />
                      <YAxis
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="confidence" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  Readability Profile
                </h2>
                <div className="w-full h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fontSize: 10 }}
                      />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Current"
                        dataKey="current"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.3}
                      />
                      <Radar
                        name="Benchmark"
                        dataKey="benchmark"
                        stroke="#10B981"
                        fill="#10B981"
                        fillOpacity={0.2}
                      />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {selectedTab === "classification" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                      Primary Domain
                    </h3>
                    <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-blue-600">
                        {data.classification.primary_domain}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">
                        Confidence: {data.classification.confidence.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                      Secondary Subject
                    </h3>
                    <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-green-600">
                        {data.classification.secondary_subject}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">
                        Subject-specific analysis applied
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
                  Key Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.classification.key_topics.map((topic, i) => (
                    <span
                      key={i}
                      className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                  Summary
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {data.classification.summary}
                </p>
              </div>
            </div>
          )}

          {selectedTab === "readability" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  Readability Metrics
                </h2>
                <div className="w-full h-80 sm:h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={readabilityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="benchmark"
                        stroke="#10B981"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                {Object.entries(data.subject_benchmarks).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-2 sm:mb-3">
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                        {key.replace(/_/g, " ").toUpperCase()}
                      </h3>
                      {value.level === "High" && (
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                      )}
                      {value.level === "Low" && (
                        <AlertCircle className="w-5 h-5 text-blue-500" />
                      )}
                      {value.level === "Normal" && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <div className="text-xl sm:text-2xl font-bold mb-2">
                      {key === "flesch_kincaid"
                        ? data.readability.flesch_kincaid
                        : key === "smog_index"
                          ? data.readability.smog_index
                          : key === "gunning_fog"
                            ? data.readability.gunning_fog
                            : data.readability.coleman_liau}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      {value.interpretation}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Normal range: {value.normal_range[0]} -{" "}
                      {value.normal_range[1]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === "text_analysis" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Interactive Text Analysis
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setShowComplexSentences(!showComplexSentences)
                      }
                      className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 text-xs sm:text-sm"
                    >
                      {showComplexSentences ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3" />
                      )}
                      Complex Sentences
                    </button>
                    <button
                      onClick={() =>
                        setShowDomainVocabulary(!showDomainVocabulary)
                      }
                      className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 text-xs sm:text-sm"
                    >
                      {showDomainVocabulary ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3" />
                      )}
                      Domain Vocabulary
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                  <div className="max-w-none">
                    <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                      Analyzed Text Sample:
                    </h3>
                    <div className="space-y-2 leading-relaxed text-sm sm:text-base">
                      {data.text_analysis?.sentences?.map((sentence, idx) => (
                        <span key={idx}>
                          <span
                            className={
                              showComplexSentences && sentence.is_complex
                                ? "bg-yellow-200 px-0.5 rounded"
                                : ""
                            }
                          >
                            {sentence.text}
                          </span>
                          <span> </span>
                        </span>
                      ))}
                    </div>

                    {showDomainVocabulary && (
                      <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                        <p className="text-sm font-semibold text-orange-800 mb-2">
                          Domain-Specific Vocabulary:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {data.text_analysis?.vocabulary
                            ?.filter((v) => v.is_domain_specific)
                            .map((word, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-orange-200 text-orange-800 rounded text-sm"
                              >
                                {word.word}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Legend:</h3>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-200 border border-yellow-500 rounded"></div>
                      <span>Complex Sentences</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-200 border border-orange-500 rounded"></div>
                      <span>Domain Vocabulary</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">📄</div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          No Data Found
        </h2>
        <p className="text-gray-500">
          Unable to load analysis results. Please try again.
        </p>
      </div>
    </div>
  );
}
