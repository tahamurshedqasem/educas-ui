// src/services/pdfService.js
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generatePDFReport = async (
  analysisData,
  elementId = "report-content",
) => {
  try {
    // Get the element to convert to PDF
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error("Report element not found");
    }

    // Show loading indicator
    const loadingOverlay = document.createElement("div");
    loadingOverlay.id = "pdf-loading-overlay";
    loadingOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 18px;
      font-weight: bold;
    `;
    loadingOverlay.innerHTML =
      '<div style="text-align: center;">Generating PDF Report...<br/><span style="font-size: 14px;">Please wait</span></div>';
    document.body.appendChild(loadingOverlay);

    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    // Create PDF
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    const filename = `EduCAS_Report_${analysisData.sessionId}_${new Date().toISOString().split("T")[0]}.pdf`;
    pdf.save(filename);

    // Remove loading overlay
    document.body.removeChild(loadingOverlay);

    return true;
  } catch (error) {
    console.error("PDF generation failed:", error);
    // Remove loading overlay if it exists
    const overlay = document.getElementById("pdf-loading-overlay");
    if (overlay) {
      document.body.removeChild(overlay);
    }
    throw error;
  }
};

// Alternative: Generate simple text-based PDF (faster, no canvas)
export const generateSimplePDFReport = (analysisData) => {
  const pdf = new jsPDF();
  let yPosition = 20;
  const lineHeight = 7;
  const pageWidth = 180;
  const margin = 15;

  // Helper function to add text with wrapping
  const addWrappedText = (text, x, y, maxWidth) => {
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return lines.length * lineHeight;
  };

  // Add Title
  pdf.setFontSize(20);
  pdf.setTextColor(46, 125, 50);
  pdf.text("EduCAS Educational Analysis Report", margin, yPosition);
  yPosition += lineHeight * 2;

  // Add Document Info
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "bold");
  pdf.text("Document Information", margin, yPosition);
  yPosition += lineHeight;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  addWrappedText(
    `Document Name: ${analysisData.document.name}`,
    margin,
    yPosition,
    pageWidth,
  );
  yPosition += lineHeight;
  addWrappedText(
    `Document Type: ${analysisData.document.type.toUpperCase()}`,
    margin,
    yPosition,
    pageWidth,
  );
  yPosition += lineHeight;
  addWrappedText(
    `File Size: ${(analysisData.document.size / 1024).toFixed(2)} KB`,
    margin,
    yPosition,
    pageWidth,
  );
  yPosition += lineHeight;
  addWrappedText(
    `Analysis Date: ${new Date(analysisData.document.timestamp).toLocaleString()}`,
    margin,
    yPosition,
    pageWidth,
  );
  yPosition += lineHeight;
  addWrappedText(
    `Session ID: ${analysisData.sessionId}`,
    margin,
    yPosition,
    pageWidth,
  );
  yPosition += lineHeight * 1.5;

  // Add Classification Results
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("AI Classification Results", margin, yPosition);
  yPosition += lineHeight;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  addWrappedText(
    `Primary Domain: ${analysisData.classification.primaryDomain}`,
    margin,
    yPosition,
    pageWidth,
  );
  yPosition += lineHeight;
  addWrappedText(
    `Secondary Subject: ${analysisData.classification.secondarySubject}`,
    margin,
    yPosition,
    pageWidth,
  );
  yPosition += lineHeight;
  addWrappedText(
    `Confidence Score: ${analysisData.classification.confidence}%`,
    margin,
    yPosition,
    pageWidth,
  );
  yPosition += lineHeight;
  addWrappedText(
    `Specialized Topics: ${analysisData.classification.specializedTopics.join(", ")}`,
    margin,
    yPosition,
    pageWidth,
  );
  yPosition += lineHeight * 1.5;

  // Add Readability Metrics
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("Readability Analysis", margin, yPosition);
  yPosition += lineHeight;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  addWrappedText(
    `Flesch-Kincaid Score: ${analysisData.readability.fleschKincaid} (Benchmark: ${analysisData.readability.benchmark.fleschKincaid})`,
    margin,
    yPosition,
    pageWidth,
  );
  yPosition += lineHeight;
  addWrappedText(
    `SMOG Index: ${analysisData.readability.smog} (Benchmark: ${analysisData.readability.benchmark.smog})`,
    margin,
    yPosition,
    pageWidth,
  );
  yPosition += lineHeight;
  addWrappedText(
    `Gunning Fog Index: ${analysisData.readability.gunningFog} (Benchmark: ${analysisData.readability.benchmark.gunningFog})`,
    margin,
    yPosition,
    pageWidth,
  );
  yPosition += lineHeight;
  addWrappedText(
    `Coleman-Liau Index: ${analysisData.readability.colemanLiau} (Benchmark: ${analysisData.readability.benchmark.colemanLiau})`,
    margin,
    yPosition,
    pageWidth,
  );
  yPosition += lineHeight;
  addWrappedText(
    `Subject Context: ${analysisData.readability.subjectContext}`,
    margin,
    yPosition,
    pageWidth,
  );
  yPosition += lineHeight;

  // Word Complexity
  addWrappedText(`Word Complexity Distribution:`, margin, yPosition, pageWidth);
  yPosition += lineHeight;
  addWrappedText(
    `  • Standard Vocabulary: ${analysisData.readability.wordComplexity.standard}%`,
    margin,
    yPosition,
    pageWidth,
  );
  yPosition += lineHeight;
  addWrappedText(
    `  • Domain-Specific Terms: ${analysisData.readability.wordComplexity.domainSpecific}%`,
    margin,
    yPosition,
    pageWidth,
  );
  yPosition += lineHeight;
  addWrappedText(
    `  • Complex Terms: ${analysisData.readability.wordComplexity.complex}%`,
    margin,
    yPosition,
    pageWidth,
  );
  yPosition += lineHeight * 1.5;

  // Add Vocabulary Analysis (if space allows)
  if (yPosition < 250) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("Vocabulary Analysis", margin, yPosition);
    yPosition += lineHeight;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("Domain-Specific Terms:", margin, yPosition);
    yPosition += lineHeight;

    analysisData.vocabulary.domainTerms.slice(0, 3).forEach((term) => {
      addWrappedText(
        `  • ${term.word} (appears ${term.count} times): ${term.definition}`,
        margin,
        yPosition,
        pageWidth,
      );
      yPosition += lineHeight;
    });

    yPosition += lineHeight / 2;

    pdf.text("Potentially Complex Terms:", margin, yPosition);
    yPosition += lineHeight;

    analysisData.vocabulary.complexTerms.slice(0, 3).forEach((term) => {
      addWrappedText(
        `  • ${term.word} (complexity: ${term.complexityScore}/10): ${term.suggestion}`,
        margin,
        yPosition,
        pageWidth,
      );
      yPosition += lineHeight;
    });
    yPosition += lineHeight / 2;
  }

  // Add Document Statistics
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("Document Statistics", margin, yPosition);
  yPosition += lineHeight;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  addWrappedText(
    `Word Count: ${analysisData.metadata.wordCount.toLocaleString()}`,
    margin,
    yPosition,
    pageWidth,
  );
  yPosition += lineHeight;
  addWrappedText(
    `Character Count: ${analysisData.metadata.characterCount.toLocaleString()}`,
    margin,
    yPosition,
    pageWidth,
  );
  yPosition += lineHeight;
  addWrappedText(
    `Sentence Count: ${analysisData.metadata.sentenceCount}`,
    margin,
    yPosition,
    pageWidth,
  );
  yPosition += lineHeight;
  addWrappedText(
    `Average Word Length: ${analysisData.metadata.avgWordLength} characters`,
    margin,
    yPosition,
    pageWidth,
  );
  yPosition += lineHeight;
  addWrappedText(
    `Processing Time: ${(analysisData.metadata.processingTime / 1000).toFixed(2)} seconds`,
    margin,
    yPosition,
    pageWidth,
  );
  yPosition += lineHeight * 1.5;

  // Add Footer
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text(
    "Generated by EduCAS - Educational Content Analysis System",
    margin,
    285,
  );
  pdf.text(`Report ID: ${analysisData.sessionId}`, margin, 290);

  // Save the PDF
  const filename = `EduCAS_Report_${analysisData.sessionId}_${new Date().toISOString().split("T")[0]}.pdf`;
  pdf.save(filename);

  return true;
};
