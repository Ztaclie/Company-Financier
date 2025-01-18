import { useState, useEffect } from "react";
import { storageService } from "../services/StorageService";
import TransactionForm from "./TransactionForm";

const TransactionCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weeklyData, setWeeklyData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    // Initialize storage when component mounts
    storageService.initializeStorage();
    loadMonthData();
  }, [currentDate]);

  const loadMonthData = () => {
    const data = storageService.getData();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString();
    setWeeklyData(data.transactions[year]?.months[month]?.weeks || {});

    // If no data exists for this month, create initial structure
    if (!data.transactions[year]?.months[month]) {
      const initialTransaction = {
        type: "income",
        amount: 0,
        category: "Other Income",
        description: "Initial Balance",
        timestamp: new Date(year, parseInt(month) - 1, 1).toISOString(),
      };
      storageService.addTransaction(initialTransaction);
      loadMonthData(); // Reload data after adding initial transaction
    }
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

  const handleDeleteTransaction = (transactionId) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      storageService.deleteTransaction(transactionId);
      loadMonthData();
    }
  };

  const TransactionItem = ({ transaction }) => (
    <div className="text-sm flex justify-between items-center border-b pb-1 group">
      <div className="flex items-center">
        <span
          className={`inline-block w-2 h-2 rounded-full mr-2 ${
            transaction.type === "income" ? "bg-green-500" : "bg-red-500"
          }`}
        ></span>
        <span className="text-gray-700">{transaction.description}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span
          className={
            transaction.type === "income" ? "text-green-600" : "text-red-600"
          }
        >
          {formatCurrency(transaction.amount)}
        </span>
        <div className="hidden group-hover:flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingTransaction(transaction);
              setShowForm(true);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteTransaction(transaction.id);
            }}
            className="text-gray-400 hover:text-red-600"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );

  const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="bg-gray-100 px-4 py-2 rounded-t-lg flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {editingTransaction ? "Edit Transaction" : "New Transaction"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  // Helper function to generate dates for the current month
  const getCurrentMonthDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dates = {};

    for (
      let date = new Date(firstDay);
      date <= lastDay;
      date.setDate(date.getDate() + 1)
    ) {
      const weekNum = storageService.getWeekNumber(date);
      const dateString = date.toISOString().split("T")[0];

      if (!dates[weekNum]) {
        dates[weekNum] = [];
      }
      dates[weekNum].push(dateString);
    }

    return dates;
  };

  const monthDates = getCurrentMonthDates();

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
        {Object.entries(monthDates).map(([weekNumber, dates]) => {
          const weekData = weeklyData[weekNumber] || {
            stats: { totalIncome: 0, totalExpense: 0, netAmount: 0 },
            days: {},
          };

          return (
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
                {dates.map((dateString) => {
                  const dayData = weekData.days[dateString] || {
                    transactions: [],
                    stats: { netAmount: 0 },
                  };

                  return (
                    <div key={dateString} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">
                          {formatDate(dateString)}
                        </h4>
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
                          <TransactionItem
                            key={transaction.id}
                            transaction={transaction}
                          />
                        ))}
                      </div>

                      {/* Add Transaction Button */}
                      <button
                        onClick={() => {
                          setSelectedDate(dateString);
                          setEditingTransaction(null);
                          setShowForm(true);
                        }}
                        className="mt-2 w-full text-sm text-emerald-600 hover:text-emerald-700 text-center"
                      >
                        + Add Transaction
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Transaction Form Modal */}
      {showForm && (
        <Modal
          onClose={() => {
            setShowForm(false);
            setEditingTransaction(null);
          }}
        >
          <TransactionForm
            date={selectedDate}
            initialData={editingTransaction}
            onComplete={() => {
              setShowForm(false);
              setEditingTransaction(null);
              loadMonthData();
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default TransactionCalendar;
