const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="bg-emerald-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Company Financier</h1>
          <p className="text-xl mb-8">
            Simple, secure, and offline financial tracking for small businesses
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-emerald-600 px-6 py-2 rounded-lg font-semibold hover:bg-emerald-50"
          >
            Start Managing Finances
          </button>
        </div>
      </header>

      {/* ... rest of your landing page code ... */}
    </div>
  );
};

export default LandingPage;
