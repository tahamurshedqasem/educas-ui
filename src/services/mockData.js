// src/services/mockData.js
import { v4 as uuidv4 } from "uuid";

// Sample educational texts for different subjects
const sampleTexts = {
  stem: `Physics is the natural science that studies matter, its fundamental constituents, its motion and behavior through space and time, and the related entities of energy and force. Physics is one of the most fundamental scientific disciplines, with its main goal being to understand how the universe behaves. A scientist who specializes in the field of physics is called a physicist. Physics is one of the oldest academic disciplines and, through its inclusion of astronomy, perhaps the oldest. Over much of the past two millennia, physics, chemistry, biology, and certain branches of mathematics were a part of natural philosophy, but during the Scientific Revolution in the 17th century, these natural sciences emerged as unique research endeavors in their own right. Physics intersects with many interdisciplinary areas of research, such as biophysics and quantum chemistry, and the boundaries of physics are not rigidly defined. New ideas in physics often explain the fundamental mechanisms of other sciences while opening new avenues of research in mathematical and philosophical areas.`,

  humanities: `The study of history is more than simply memorizing dates and events; it is the art of understanding how societies evolve, how cultures develop, and how human experiences shape our present reality. Historians analyze primary sources, interpret evidence, and construct narratives that help us comprehend the complexity of human civilization. From ancient civilizations to modern nation-states, the discipline of history offers invaluable insights into political systems, economic structures, and social transformations. The historical method requires careful analysis of sources, awareness of bias, and understanding of context. Historians must consider multiple perspectives and recognize that historical interpretation is often contested and refined as new evidence emerges. This dynamic nature of historical study makes it a vibrant and essential field for understanding our collective past and informing our future decisions.`,

  social: `Psychology is the scientific study of mind and behavior. Psychology includes the study of conscious and unconscious phenomena, including feelings and thoughts. It is an academic discipline of immense scope, crossing the boundaries between the natural and social sciences. Psychologists seek an understanding of the emergent properties of brains, linking the discipline to neuroscience. As social scientists, psychologists aim to understand the behavior of individuals and groups. A professional practitioner or researcher involved in the discipline is called a psychologist. Some psychologists can also be classified as behavioral or cognitive scientists. Some psychologists attempt to understand the role of mental functions in individual and social behavior. Others explore the physiological and neurobiological processes that underlie cognitive functions and behaviors.`,

  mixed: `The Renaissance was a period in European history marking the transition from the Middle Ages to modernity and covering the 15th and 16th centuries. It occurred after the Crisis of the Late Middle Ages and was associated with great social change. In addition to the standard periodization, proponents of a "long Renaissance" may put its beginning in the 14th century and its end in the 17th century. The traditional view focuses more on the early modern aspects of the Renaissance and argues that it was a break from the past, but many historians today focus more on its medieval aspects and argue that it was an extension of the Middle Ages. The intellectual basis of the Renaissance was its version of humanism, derived from the concept of Roman Humanitas and the rediscovery of classical Greek philosophy, such as that of Protagoras, who said that "Man is the measure of all things."`,
};

// Generate random session ID
const generateSessionId = () => {
  return uuidv4().substring(0, 8);
};

// Generate random confidence score between 65 and 98
const getRandomConfidence = () => {
  return Math.floor(Math.random() * 33) + 65;
};

// Determine subject based on content or filename
const determineSubject = (content, filename = "") => {
  const text = (content + filename).toLowerCase();

  if (
    text.includes("physic") ||
    text.includes("chemist") ||
    text.includes("biolog") ||
    text.includes("math") ||
    text.includes("science") ||
    text.includes("engineering")
  ) {
    return {
      primaryDomain: "STEM",
      secondarySubject: text.includes("physic")
        ? "Physics"
        : text.includes("chem")
          ? "Chemistry"
          : text.includes("biolog")
            ? "Biology"
            : "General Science",
      specializedTopics: [
        "Scientific Method",
        "Empirical Research",
        "Quantitative Analysis",
      ],
    };
  } else if (
    text.includes("histor") ||
    text.includes("literature") ||
    text.includes("philosoph") ||
    text.includes("art") ||
    text.includes("language")
  ) {
    return {
      primaryDomain: "Humanities",
      secondarySubject: text.includes("histor")
        ? "History"
        : text.includes("literature")
          ? "Literature"
          : "General Humanities",
      specializedTopics: [
        "Critical Analysis",
        "Historical Context",
        "Cultural Interpretation",
      ],
    };
  } else {
    return {
      primaryDomain: "Social Sciences",
      secondarySubject: text.includes("psych")
        ? "Psychology"
        : text.includes("sociolog")
          ? "Sociology"
          : "General Social Sciences",
      specializedTopics: [
        "Human Behavior",
        "Social Structures",
        "Research Methods",
      ],
    };
  }
};

// Generate readability metrics based on subject
const generateReadabilityMetrics = (subject, text) => {
  const wordCount = text.split(/\s+/).length;
  const sentenceCount = text.split(/[.!?]+/).length;
  const avgWordsPerSentence = wordCount / Math.max(sentenceCount, 1);

  // Base metrics vary by subject
  const baseMetrics = {
    STEM: {
      fleschKincaid: 12.5,
      smog: 11.2,
      gunningFog: 13.8,
      colemanLiau: 12.3,
    },
    Humanities: {
      fleschKincaid: 10.2,
      smog: 8.5,
      gunningFog: 11.5,
      colemanLiau: 10.8,
    },
    "Social Sciences": {
      fleschKincaid: 11.4,
      smog: 9.8,
      gunningFog: 12.7,
      colemanLiau: 11.5,
    },
  };

  const metrics =
    baseMetrics[subject.primaryDomain] || baseMetrics["Social Sciences"];

  // Add some variation based on actual text
  const variation = (avgWordsPerSentence - 15) / 10;

  return {
    fleschKincaid: +(metrics.fleschKincaid + variation).toFixed(1),
    smog: +(metrics.smog + variation * 0.8).toFixed(1),
    gunningFog: +(metrics.gunningFog + variation).toFixed(1),
    colemanLiau: +(metrics.colemanLiau + variation * 0.6).toFixed(1),
    benchmark: {
      fleschKincaid: metrics.fleschKincaid,
      smog: metrics.smog,
      gunningFog: metrics.gunningFog,
      colemanLiau: metrics.colemanLiau,
    },
    subjectContext: subject.primaryDomain,
    wordComplexity: {
      standard: Math.floor(70 + Math.random() * 15),
      domainSpecific: Math.floor(15 + Math.random() * 10),
      complex: Math.floor(5 + Math.random() * 10),
    },
  };
};

// Generate vocabulary analysis
const generateVocabulary = (subject, text) => {
  const domainTerms = {
    STEM: [
      {
        word: "quantum",
        count: 2,
        definition: "Relating to discrete quantities in physics",
      },
      {
        word: "empirical",
        count: 3,
        definition: "Based on observation and experiment",
      },
      {
        word: "hypothesis",
        count: 2,
        definition: "A proposed explanation for a phenomenon",
      },
      {
        word: "methodology",
        count: 2,
        definition: "A system of methods used in a particular area",
      },
      {
        word: "analysis",
        count: 4,
        definition: "Detailed examination of elements or structure",
      },
    ],
    Humanities: [
      {
        word: "discourse",
        count: 2,
        definition: "Written or spoken communication or debate",
      },
      {
        word: "narrative",
        count: 3,
        definition: "A spoken or written account of connected events",
      },
      {
        word: "contextualize",
        count: 1,
        definition: "Place in context for understanding",
      },
      {
        word: "paradigm",
        count: 2,
        definition: "A typical example or pattern",
      },
      {
        word: "interpretation",
        count: 3,
        definition: "The action of explaining meaning",
      },
    ],
    "Social Sciences": [
      {
        word: "cognition",
        count: 2,
        definition: "The mental action of acquiring knowledge",
      },
      {
        word: "behavioral",
        count: 3,
        definition: "Relating to observable actions",
      },
      {
        word: "societal",
        count: 2,
        definition: "Relating to society or social relations",
      },
      {
        word: "developmental",
        count: 2,
        definition: "Relating to growth and progression",
      },
      {
        word: "empirical",
        count: 3,
        definition: "Based on observation rather than theory",
      },
    ],
  };

  const complexTerms = [
    {
      word: "methodology",
      count: 2,
      complexityScore: 7.5,
      suggestion: "Consider simplifying or providing definition",
    },
    {
      word: "fundamental",
      count: 3,
      complexityScore: 6.8,
      suggestion: "Common term, but may be complex for beginners",
    },
    {
      word: "constituent",
      count: 1,
      complexityScore: 8.2,
      suggestion: 'Use "component" or "part" for simpler text',
    },
    {
      word: "disciplinary",
      count: 2,
      complexityScore: 7.1,
      suggestion: "May be acceptable in academic context",
    },
  ];

  return {
    domainTerms:
      domainTerms[subject.primaryDomain] || domainTerms["Social Sciences"],
    complexTerms: complexTerms,
  };
};

// Generate highlights for text
const generateHighlights = (text, subject) => {
  const highlights = [];

  // Find complex sentences (long sentences)
  const sentences = text.split(/[.!?]+/);
  sentences.forEach((sentence) => {
    if (sentence.split(/\s+/).length > 25) {
      highlights.push({
        text: sentence.trim().substring(0, 100),
        type: "complex",
      });
    }
  });

  // Add domain-specific terms based on subject
  const domainWords = {
    STEM: [
      "quantum",
      "physics",
      "science",
      "fundamental",
      "energy",
      "matter",
      "motion",
    ],
    Humanities: [
      "history",
      "culture",
      "society",
      "civilization",
      "ancient",
      "medieval",
    ],
    "Social Sciences": [
      "behavior",
      "psychology",
      "social",
      "cognitive",
      "development",
    ],
  };

  const words =
    domainWords[subject.primaryDomain] || domainWords["Social Sciences"];
  words.forEach((word) => {
    if (text.toLowerCase().includes(word)) {
      highlights.push({
        text: word,
        type: "domain",
      });
    }
  });

  return highlights.slice(0, 10); // Limit to 10 highlights
};

// Main function to generate mock analysis result
export const generateMockAnalysisResult = (filename, customText = null) => {
  const sessionId = generateSessionId();

  // Use custom text or sample based on filename
  let text = customText;
  if (!text) {
    if (
      filename.toLowerCase().includes("stem") ||
      filename.toLowerCase().includes("physic")
    ) {
      text = sampleTexts.stem;
    } else if (
      filename.toLowerCase().includes("human") ||
      filename.toLowerCase().includes("histor")
    ) {
      text = sampleTexts.humanities;
    } else if (
      filename.toLowerCase().includes("social") ||
      filename.toLowerCase().includes("psych")
    ) {
      text = sampleTexts.social;
    } else {
      text = sampleTexts.mixed;
    }
  }

  const subject = determineSubject(text, filename);
  const confidence = getRandomConfidence();

  return {
    sessionId: sessionId,
    document: {
      name: filename,
      type: filename.includes(".") ? filename.split(".").pop() : "txt",
      size: Math.floor(Math.random() * 500000) + 100000,
      text: text,
      timestamp: new Date().toISOString(),
    },
    classification: {
      primaryDomain: subject.primaryDomain,
      secondarySubject: subject.secondarySubject,
      specializedTopics: subject.specializedTopics,
      confidence: confidence,
      modelVersion: "DistilBERT-base-educas-v1",
    },
    readability: generateReadabilityMetrics(subject, text),
    vocabulary: generateVocabulary(subject, text),
    highlights: generateHighlights(text, subject),
    metadata: {
      processingTime: Math.floor(Math.random() * 3000) + 2000,
      wordCount: text.split(/\s+/).length,
      characterCount: text.length,
      sentenceCount: text.split(/[.!?]+/).length,
      avgWordLength: (text.length / text.split(/\s+/).length).toFixed(1),
    },
  };
};

// Function to get stored analysis result
export const getMockAnalysisResult = (sessionId) => {
  const stored = localStorage.getItem(`analysis_${sessionId}`);
  if (stored) {
    return JSON.parse(stored);
  }

  // If not found, generate a new one
  return generateMockAnalysisResult(`document_${sessionId}.txt`);
};
