import { useState } from "react";
import { storageService } from "../services/StorageService";

const TransactionForm = ({ date, onComplete, initialData = null }) => {
  const [formData, setFormData] = useState({
    type: initialData?.type || "expense",
    amount: initialData?.amount || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    timestamp: initialData?.timestamp || new Date(date).toISOString(),
  });

  const categories = storageService.getData().businessInfo.settings.categories;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (initialData?.id) {
      // Update existing transaction
      storageService.editTransaction(initialData.id, {
        ...formData,
        amount: parseFloat(formData.amount),
      });
    } else {
      // Create new transaction
      storageService.addTransaction({
        ...formData,
        amount: parseFloat(formData.amount),
      });
    }

    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="w-full border rounded-md px-3 py-2"
          required
        >
          <option value="">Select a category</option>
          {formData.type === "income"
            ? categories.income.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))
            : categories.expense.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full border rounded-md px-3 py-2"
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onComplete}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
        >
          {initialData ? "Update" : "Add"} Transaction
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
