export default function TestPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Tailwind Test Page</h2>
      <div className="bg-white p-4 rounded-md shadow-md">
        <p className="text-gray-700">
          This page tests the Tailwind CSS configuration with various color utilities:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-gray-50 p-3 rounded-md">Gray 50</div>
          <div className="bg-gray-100 p-3 rounded-md">Gray 100</div>
          <div className="bg-gray-200 p-3 rounded-md">Gray 200</div>
          <div className="bg-indigo-100 p-3 rounded-md text-indigo-900">Indigo 100</div>
          <div className="bg-indigo-500 p-3 rounded-md text-white">Indigo 500</div>
          <div className="bg-indigo-900 p-3 rounded-md text-white">Indigo 900</div>
        </div>
      </div>
    </div>
  );
} 