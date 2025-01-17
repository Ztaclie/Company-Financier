import { storageService } from "../services/StorageService";

const Transactions = () => {
  const addNewTransaction = (transactionData) => {
    const transaction = {
      type: "income",
      amount: 100,
      category: "Sales",
      description: "Product sale",
      timestamp: new Date().toISOString(),
    };

    storageService.addTransaction(transaction);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Transactions</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        {/* Transaction form and list will go here */}
      </div>
    </div>
  );
};

export default Transactions;
