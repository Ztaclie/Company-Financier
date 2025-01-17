import TransactionCalendar from "../components/TransactionCalendar";

const Transactions = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Transactions</h1>
      <TransactionCalendar />
    </div>
  );
};

export default Transactions;
