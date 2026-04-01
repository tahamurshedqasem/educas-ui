export default function Dashboard() {
  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-6">Analysis Results</h1>

        {/* Classification */}
        <div className="mb-6">
          <h2 className="font-semibold text-lg">Classification</h2>
          <p>
            Domain: <b>STEM (90%)</b>
          </p>
          <p>
            Subject: <b>Physics</b>
          </p>
        </div>

        {/* Readability */}
        <div className="mb-6">
          <h2 className="font-semibold text-lg">Readability</h2>
          <p>Flesch Score: 12</p>
          <p>SMOG Score: 10</p>
        </div>

        {/* Text Viewer */}
        <div className="mb-6">
          <h2 className="font-semibold text-lg">Text Viewer</h2>
          <p className="bg-yellow-100 p-3 rounded">
            This is a complex sentence highlighted in yellow.
          </p>
          <p className="bg-orange-100 p-3 rounded mt-2">
            Technical vocabulary highlighted in orange.
          </p>
        </div>

        {/* Download */}
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Download Report
        </button>
      </div>
    </main>
  );
}
