import { v4 as uuidv4 } from "uuid";

class StorageService {
  constructor() {
    this.STORAGE_KEY = "company_financier_data";
  }

  // Initialize storage with default values
  initializeStorage() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const initialData = {
        businessInfo: {
          name: "",
          currency: "USD",
          startDate: new Date().toISOString(),
          settings: {
            fiscalYearStart: 1,
            weekStart: 0,
            categories: {
              income: ["Sales", "Services", "Other Income"],
              expense: [
                "Supplies",
                "Utilities",
                "Rent",
                "Salaries",
                "Other Expenses",
              ],
            },
          },
        },
        transactions: {},
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData));
    }
  }

  // Add new transaction
  addTransaction(transaction) {
    const data = this.getData();
    const date = new Date(transaction.timestamp);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();
    const weekNumber = this.getWeekNumber(date).toString();
    const dateString = date.toISOString().split("T")[0];

    // Create transaction object
    const newTransaction = {
      ...transaction,
      id: uuidv4(),
    };

    // Ensure path exists and add transaction
    this.ensureDataPathExists(data, year, month, weekNumber, dateString);

    // Add transaction
    data.transactions[year].months[month].weeks[weekNumber].days[
      dateString
    ].transactions.push(newTransaction);

    // Update stats and handle safe money transfer
    this.updateStatsAndTransferSafe(data, year, month, weekNumber, dateString);

    this.saveData(data);
    return newTransaction;
  }

  ensureDataPathExists(data, year, month, weekNumber, dateString) {
    if (!data.transactions[year]) {
      data.transactions[year] = { stats: this.createEmptyStats(), months: {} };
    }
    if (!data.transactions[year].months[month]) {
      data.transactions[year].months[month] = {
        stats: this.createEmptyStats(),
        weeks: {},
      };
    }
    if (!data.transactions[year].months[month].weeks[weekNumber]) {
      data.transactions[year].months[month].weeks[weekNumber] = {
        stats: this.createEmptyStats(),
        days: {},
      };
    }
    if (
      !data.transactions[year].months[month].weeks[weekNumber].days[dateString]
    ) {
      // Check for previous day's safe money
      const previousDaySafe = this.getPreviousDaySafeMoney(data, dateString);

      data.transactions[year].months[month].weeks[weekNumber].days[dateString] =
        {
          transactions: [],
          stats: this.createEmptyStats(),
        };

      // Add safe money transaction if exists
      if (previousDaySafe > 0) {
        this.addSafeMoneyTransaction(
          data,
          year,
          month,
          weekNumber,
          dateString,
          previousDaySafe
        );
      }
    }
  }

  getPreviousDaySafeMoney(data, currentDateString) {
    const currentDate = new Date(currentDateString);
    const previousDate = new Date(currentDate);
    previousDate.setDate(previousDate.getDate() - 1);

    const prevYear = previousDate.getFullYear().toString();
    const prevMonth = (previousDate.getMonth() + 1).toString();
    const prevWeek = this.getWeekNumber(previousDate).toString();
    const prevDateString = previousDate.toISOString().split("T")[0];

    const prevDayData =
      data.transactions[prevYear]?.months[prevMonth]?.weeks[prevWeek]?.days[
        prevDateString
      ];
    return prevDayData ? prevDayData.stats.netAmount : 0;
  }

  addSafeMoneyTransaction(data, year, month, week, dateString, amount) {
    const safeTransaction = {
      id: uuidv4(),
      type: "income",
      amount: amount,
      category: "Safe",
      description: "Previous day safe money",
      timestamp: new Date(dateString).toISOString(),
    };

    data.transactions[year].months[month].weeks[week].days[
      dateString
    ].transactions.push(safeTransaction);
  }

  updateStatsAndTransferSafe(data, year, month, week, dateString) {
    // Update current day stats
    this.updateStats(data, year, month, week, dateString);

    // Check if it's the last day of the week
    const currentDate = new Date(dateString);
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const currentWeek = this.getWeekNumber(currentDate);
    const nextWeek = this.getWeekNumber(nextDate);

    // If next day is in a new week, transfer safe money
    if (currentWeek !== nextWeek) {
      const currentWeekData = data.transactions[year].months[month].weeks[week];
      const safeMoney = currentWeekData.stats.netAmount;

      if (safeMoney > 0) {
        const nextYear = nextDate.getFullYear().toString();
        const nextMonth = (nextDate.getMonth() + 1).toString();
        const nextWeekNum = nextWeek.toString();
        const nextDateString = nextDate.toISOString().split("T")[0];

        this.ensureDataPathExists(
          data,
          nextYear,
          nextMonth,
          nextWeekNum,
          nextDateString
        );
        this.addSafeMoneyTransaction(
          data,
          nextYear,
          nextMonth,
          nextWeekNum,
          nextDateString,
          safeMoney
        );
        this.updateStats(
          data,
          nextYear,
          nextMonth,
          nextWeekNum,
          nextDateString
        );
      }
    }
  }

  // Add method to edit transaction
  editTransaction(transactionId, updatedData) {
    const data = this.getData();
    let found = false;

    // Search through the data structure to find and update the transaction
    Object.entries(data.transactions).forEach(([year, yearData]) => {
      Object.entries(yearData.months).forEach(([month, monthData]) => {
        Object.entries(monthData.weeks).forEach(([week, weekData]) => {
          Object.entries(weekData.days).forEach(([date, dayData]) => {
            const transactionIndex = dayData.transactions.findIndex(
              (t) => t.id === transactionId
            );
            if (transactionIndex !== -1) {
              dayData.transactions[transactionIndex] = {
                ...dayData.transactions[transactionIndex],
                ...updatedData,
              };
              found = true;
              this.updateStatsAndTransferSafe(data, year, month, week, date);
            }
          });
        });
      });
    });

    if (found) {
      this.saveData(data);
      return true;
    }
    return false;
  }

  // Get transactions for a specific period
  getTransactions(period, date) {
    const data = this.getData();
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();
    const weekNumber = this.getWeekNumber(date).toString();
    const dateString = date.toISOString().split("T")[0];

    switch (period) {
      case "day":
        return (
          data.transactions[year]?.months[month]?.weeks[weekNumber]?.days[
            dateString
          ]?.transactions || []
        );
      case "week":
        return this.aggregateTransactions(data, year, month, weekNumber);
      case "month":
        return this.aggregateTransactionsForMonth(data, year, month);
      case "year":
        return this.aggregateTransactionsForYear(data, year);
      default:
        return [];
    }
  }

  // Helper methods
  getData() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "{}");
  }

  saveData(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  createEmptyStats() {
    return {
      totalIncome: 0,
      totalExpense: 0,
      netAmount: 0,
      topIncomeCategories: [],
      topExpenseCategories: [],
    };
  }

  getWeekNumber(date) {
    // Get first day of year
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    // Get days between target date and first day
    const pastDays = (date - firstDayOfYear) / 86400000;
    // Return the week number
    return Math.ceil((pastDays + firstDayOfYear.getDay() + 1) / 7);
  }

  updateStats(data, year, month, week, date) {
    // Update day stats
    const dayData =
      data.transactions[year].months[month].weeks[week].days[date];
    const dayTransactions = dayData.transactions;

    dayData.stats = this.calculateStats(dayTransactions);

    // Update week stats
    const weekData = data.transactions[year].months[month].weeks[week];
    const weekTransactions = Object.values(weekData.days).flatMap(
      (day) => day.transactions
    );
    weekData.stats = this.calculateStats(weekTransactions);

    // Update month stats
    const monthData = data.transactions[year].months[month];
    const monthTransactions = Object.values(monthData.weeks)
      .flatMap((week) => Object.values(week.days))
      .flatMap((day) => day.transactions);
    monthData.stats = this.calculateStats(monthTransactions);

    // Update year stats
    const yearData = data.transactions[year];
    const yearTransactions = Object.values(yearData.months)
      .flatMap((month) => Object.values(month.weeks))
      .flatMap((week) => Object.values(week.days))
      .flatMap((day) => day.transactions);
    yearData.stats = this.calculateStats(yearTransactions);
  }

  calculateStats(transactions) {
    const stats = {
      totalIncome: 0,
      totalExpense: 0,
      netAmount: 0,
      topIncomeCategories: [],
      topExpenseCategories: [],
    };

    // Calculate category totals
    const categoryTotals = {};

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        stats.totalIncome += transaction.amount;
        categoryTotals[transaction.category] =
          (categoryTotals[transaction.category] || 0) + transaction.amount;
      } else {
        stats.totalExpense += transaction.amount;
        categoryTotals[transaction.category] =
          (categoryTotals[transaction.category] || 0) + transaction.amount;
      }
    });

    stats.netAmount = stats.totalIncome - stats.totalExpense;

    // Calculate top categories
    const categories = Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);

    stats.topIncomeCategories = categories
      .filter((cat) =>
        transactions.some(
          (t) => t.type === "income" && t.category === cat.category
        )
      )
      .slice(0, 5);

    stats.topExpenseCategories = categories
      .filter((cat) =>
        transactions.some(
          (t) => t.type === "expense" && t.category === cat.category
        )
      )
      .slice(0, 5);

    return stats;
  }

  aggregateTransactions(data, year, month, week) {
    const weekData = data.transactions[year]?.months[month]?.weeks[week];
    if (!weekData) return [];
    return Object.values(weekData.days).flatMap((day) => day.transactions);
  }

  aggregateTransactionsForMonth(data, year, month) {
    const monthData = data.transactions[year]?.months[month];
    if (!monthData) return [];
    return Object.values(monthData.weeks)
      .flatMap((week) => Object.values(week.days))
      .flatMap((day) => day.transactions);
  }

  aggregateTransactionsForYear(data, year) {
    const yearData = data.transactions[year];
    if (!yearData) return [];
    return Object.values(yearData.months)
      .flatMap((month) => Object.values(month.weeks))
      .flatMap((week) => Object.values(week.days))
      .flatMap((day) => day.transactions);
  }

  deleteTransaction(transactionId) {
    const data = this.getData();
    let found = false;

    Object.entries(data.transactions).forEach(([year, yearData]) => {
      Object.entries(yearData.months).forEach(([month, monthData]) => {
        Object.entries(monthData.weeks).forEach(([week, weekData]) => {
          Object.entries(weekData.days).forEach(([date, dayData]) => {
            const transactionIndex = dayData.transactions.findIndex(
              (t) => t.id === transactionId
            );
            if (transactionIndex !== -1) {
              dayData.transactions.splice(transactionIndex, 1);
              found = true;
              this.updateStatsAndTransferSafe(data, year, month, week, date);
            }
          });
        });
      });
    });

    if (found) {
      this.saveData(data);
      return true;
    }
    return false;
  }
}

export const storageService = new StorageService();
