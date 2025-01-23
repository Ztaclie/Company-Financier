import { useState } from "react";
import { storageService } from "../services/StorageService";

const DataManagement = () => {
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = (format) => {
    let success = false;

    if (format === "json") {
      success = storageService.exportToJSON();
    } else if (format === "csv") {
      success = storageService.exportToCSV();
    }

    if (success) {
      setStatus(`Data exported successfully as ${format.toUpperCase()}!`);
      setTimeout(() => setStatus(""), 3000);
    } else {
      setStatus(`${format.toUpperCase()} export failed. Please try again.`);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setStatus("Importing data...");

    try {
      let success = false;
      if (file.name.endsWith(".json")) {
        success = await storageService.importFromJSON(file);
      } else if (file.name.endsWith(".csv")) {
        success = await storageService.importFromCSV(file);
      } else {
        throw new Error("Unsupported file format");
      }

      if (success) {
        setStatus("Data imported successfully! Refreshing...");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setStatus("Import failed. Please check the file format.");
      }
    } catch (error) {
      setStatus(`Import failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Data Management</h2>

      <div className="space-y-4">
        {/* Export Section */}
        <div>
          <h3 className="text-lg font-medium mb-2">Export Data</h3>
          <p className="text-gray-600 mb-2">
            Download your financial data in your preferred format.
          </p>
          <div className="space-x-2">
            <button
              onClick={() => handleExport("json")}
              disabled={isLoading}
              className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 
                       disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Export as JSON
            </button>
            <button
              onClick={() => handleExport("csv")}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 
                       disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Export as CSV
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-2">Import Data</h3>
          <p className="text-gray-600 mb-2">
            Import data from JSON or CSV file.
          </p>
          <label className="block">
            <span className="sr-only">Choose file</span>
            <input
              type="file"
              accept=".json,.csv"
              onChange={handleImport}
              disabled={isLoading}
              className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0
                       file:text-sm file:font-semibold
                       file:bg-emerald-50 file:text-emerald-700
                       hover:file:bg-emerald-100
                       disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </label>
        </div>

        {/* Status Message */}
        {status && (
          <div
            className={`mt-4 p-3 rounded-md ${
              status.includes("successfully")
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataManagement;
