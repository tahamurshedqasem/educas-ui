// src/services/sampleResults.js
export const sampleResults = {
  stemResult: {
    sessionId: "sample-stem-001",
    document: {
      name: "Physics_101_Introduction.pdf",
      type: "pdf",
      size: 245000,
      text: "Physics is the natural science that studies matter, its fundamental constituents, its motion and behavior through space and time...",
      timestamp: new Date().toISOString(),
    },
    classification: {
      primaryDomain: "STEM",
      secondarySubject: "Physics",
      specializedTopics: ["Mechanics", "Thermodynamics", "Quantum Theory"],
      confidence: 94,
      modelVersion: "DistilBERT-base-educas-v1",
    },
    readability: {
      fleschKincaid: 12.8,
      smog: 11.5,
      gunningFog: 14.2,
      colemanLiau: 12.7,
      benchmark: {
        fleschKincaid: 12.5,
        smog: 11.2,
        gunningFog: 13.8,
        colemanLiau: 12.3,
      },
      subjectContext: "STEM",
      wordComplexity: {
        standard: 72,
        domainSpecific: 18,
        complex: 10,
      },
    },
    vocabulary: {
      domainTerms: [
        {
          word: "quantum",
          count: 3,
          definition: "Relating to discrete quantities in physics",
        },
        {
          word: "empirical",
          count: 2,
          definition: "Based on observation and experiment",
        },
        {
          word: "fundamental",
          count: 5,
          definition: "Forming a necessary base or core",
        },
      ],
      complexTerms: [
        {
          word: "methodology",
          count: 2,
          complexityScore: 7.5,
          suggestion: "Consider simplifying",
        },
      ],
    },
    highlights: [
      {
        text: "Physics is the natural science that studies matter",
        type: "complex",
      },
      { text: "quantum", type: "domain" },
    ],
  },
};
