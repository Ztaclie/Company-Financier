import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { storageService } from "../services/StorageService";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const TransactionCharts = ({ currentDate }) => {
  const data = storageService.getData();
  const year = currentDate.getFullYear().toString();
  const month = (currentDate.getMonth() + 1).toString();
  const monthData = data.transactions[year]?.months[month];

  // Prepare data for daily income/expense chart
  const getDailyChartData = () => {
    const days = [];
    const incomes = [];
    const expenses = [];
    const balances = [];

    if (monthData) {
      Object.values(monthData.weeks).forEach((week) => {
        Object.entries(week.days).forEach(([date, dayData]) => {
          days.push(new Date(date).getDate());
          incomes.push(dayData.stats.totalIncome);
          expenses.push(dayData.stats.totalExpense);
          balances.push(dayData.stats.netAmount);
        });
      });
    }

    return {
      labels: days,
      datasets: [
        {
          label: "Income",
          data: incomes,
          backgroundColor: "rgba(34, 197, 94, 0.5)",
          borderColor: "rgb(34, 197, 94)",
          borderWidth: 1,
        },
        {
          label: "Expense",
          data: expenses,
          backgroundColor: "rgba(239, 68, 68, 0.5)",
          borderColor: "rgb(239, 68, 68)",
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare data for weekly balance chart
  const getWeeklyBalanceData = () => {
    const weeks = [];
    const balances = [];

    if (monthData) {
      Object.entries(monthData.weeks).forEach(([weekNum, weekData]) => {
        weeks.push(`Week ${weekNum}`);
        balances.push(weekData.stats.netAmount);
      });
    }

    return {
      labels: weeks,
      datasets: [
        {
          label: "Weekly Balance",
          data: balances,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          tension: 0.1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Daily Income & Expenses</h3>
        <div className="h-[300px]">
          <Bar data={getDailyChartData()} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Weekly Balance Trend</h3>
        <div className="h-[300px]">
          <Line data={getWeeklyBalanceData()} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default TransactionCharts;
