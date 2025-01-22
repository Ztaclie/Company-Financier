import { useState } from "react";
import { storageService } from "../services/StorageService";

const DataManagement = () => {
  const [importStatus, setImportStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = () => {
    if (storageService.exportData()) {
      setImportStatus("Data exported successfully!");
      setTimeout(() => setImportStatus(""), 3000);
    } else {
      setImportStatus("Export failed. Please try again.");
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setImportStatus("Importing data...");

    try {
      if (await storageService.importData(file)) {
        setImportStatus("Data imported successfully! Refreshing...");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setImportStatus("Import failed. Please check the file format.");
      }
    } catch (error) {
      setImportStatus("Import failed. Please try again.");
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
            Download all your financial data as a JSON file.
          </p>
          <button
            onClick={handleExport}
            disabled={isLoading}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 
                     disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Export Data
          </button>
        </div>

        {/* Import Section */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-2">Import Data</h3>
          <p className="text-gray-600 mb-2">
            Import previously exported data file.
          </p>
          <label className="block">
            <span className="sr-only">Choose file</span>
            <input
              type="file"
              accept=".json"
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
        {importStatus && (
          <div
            className={`mt-4 p-3 rounded-md ${
              importStatus.includes("successfully")
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {importStatus}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataManagement;
