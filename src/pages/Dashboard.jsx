import { useState } from "react";
import TransactionCharts from "../components/TransactionCharts";
import { storageService } from "../services/StorageService";

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const data = storageService.getData();
  const year = currentDate.getFullYear().toString();
  const month = (currentDate.getMonth() + 1).toString();
  const monthData = data.transactions[year]?.months[month];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Financial Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.setMonth(currentDate.getMonth() - 1))
              )
            }
            className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
          >
            Previous Month
          </button>
          <h2 className="text-xl font-semibold">
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.setMonth(currentDate.getMonth() + 1))
              )
            }
            className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
          >
            Next Month
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Total Income
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(monthData?.stats?.totalIncome || 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Total Expenses
          </h3>
          <p className="text-3xl font-bold text-red-600">
            {formatCurrency(monthData?.stats?.totalExpense || 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Net Balance
          </h3>
          <p
            className={`text-3xl font-bold ${
              monthData?.stats?.netAmount >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {formatCurrency(monthData?.stats?.netAmount || 0)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <TransactionCharts currentDate={currentDate} />
    </div>
  );
};

export default Dashboard;
