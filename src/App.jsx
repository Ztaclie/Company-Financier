const App = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="bg-emerald-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Company Financier</h1>
          <p className="text-xl mb-8">
            Simple, secure, and offline financial tracking for small businesses
          </p>
          <button className="bg-white text-emerald-600 px-6 py-2 rounded-lg font-semibold hover:bg-emerald-50">
            Start Managing Finances
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Company Financier?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 shadow-lg rounded-lg">
              <div className="text-emerald-600 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-4">
                Financial Dashboard
              </h3>
              <p>
                Track your business performance with intuitive charts and
                reports
              </p>
            </div>
            <div className="text-center p-6 shadow-lg rounded-lg">
              <div className="text-emerald-600 text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-4">Offline Storage</h3>
              <p>All your data stays on your device - no server needed</p>
            </div>
            <div className="text-center p-6 shadow-lg rounded-lg">
              <div className="text-emerald-600 text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-4">Time-Based Reports</h3>
              <p>View your finances daily, weekly, monthly, or yearly</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Ready to Take Control of Your Business Finances?
          </h2>
          <p className="mb-8">
            Start tracking your income and expenses today - completely free and
            offline
          </p>
          <button className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700">
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default App;
