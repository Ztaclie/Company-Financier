import { useState, useEffect } from "react";
import { storageService } from "../services/StorageService";

const TransactionCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weeklyData, setWeeklyData] = useState({});

  useEffect(() => {
    loadMonthData();
  }, [currentDate]);

  const loadMonthData = () => {
    const data = storageService.getData();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString();
    setWeeklyData(data.transactions[year]?.months[month]?.weeks || {});
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="p-4">
      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-6">
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
        <h2 className="text-xl font-bold">
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

      {/* Weeks Grid */}
      <div className="space-y-6">
        {Object.entries(weeklyData).map(([weekNumber, weekData]) => (
          <div key={weekNumber} className="bg-white rounded-lg shadow-lg p-4">
            <div className="border-b pb-2 mb-4">
              <h3 className="text-lg font-semibold">Week {weekNumber}</h3>
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  Income: {formatCurrency(weekData.stats.totalIncome)}
                </span>
                <span>
                  Expenses: {formatCurrency(weekData.stats.totalExpense)}
                </span>
                <span
                  className={`font-semibold ${
                    weekData.stats.netAmount >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  Net: {formatCurrency(weekData.stats.netAmount)}
                </span>
              </div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(weekData.days).map(([dateString, dayData]) => (
                <div
                  key={dateString}
                  className="border rounded-lg p-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{formatDate(dateString)}</h4>
                    <span
                      className={`text-sm font-semibold ${
                        dayData.stats.netAmount >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatCurrency(dayData.stats.netAmount)}
                    </span>
                  </div>

                  {/* Transactions List */}
                  <div className="space-y-2">
                    {dayData.transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="text-sm flex justify-between items-center border-b pb-1"
                      >
                        <div>
                          <span
                            className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              transaction.type === "income"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></span>
                          <span className="text-gray-700">
                            {transaction.description}
                          </span>
                        </div>
                        <span
                          className={
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Add Transaction Button */}
                  <button
                    onClick={() => {
                      /* Add transaction modal/form logic */
                    }}
                    className="mt-2 w-full text-sm text-emerald-600 hover:text-emerald-700 text-center"
                  >
                    + Add Transaction
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionCalendar;
