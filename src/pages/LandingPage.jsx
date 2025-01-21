const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <header className="bg-emerald-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Company Financier
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-emerald-100">
              Simple, secure, and offline financial tracking designed for your
              daily business needs
            </p>
            <button
              onClick={onGetStarted}
              className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold 
                       hover:bg-emerald-50 transform hover:scale-105 transition-all duration-200 
                       shadow-lg hover:shadow-xl"
            >
              Start Managing Finances →
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose Company Financier?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Daily Tracking
              </h3>
              <p className="text-gray-600">
                Track your income and expenses day by day with an intuitive
                calendar interface
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Works Offline
              </h3>
              <p className="text-gray-600">
                All your data is stored locally - no internet connection
                required
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Visual Reports
              </h3>
              <p className="text-gray-600">
                Get insights with beautiful charts and detailed financial
                reports
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-emerald-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            How It Works
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    Start Tracking
                  </h3>
                  <p className="text-gray-600">
                    Begin by entering your daily income and expenses in our
                    simple calendar interface
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    Monitor Progress
                  </h3>
                  <p className="text-gray-600">
                    Watch your daily balances automatically carry forward and
                    view your financial trends
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    Gain Insights
                  </h3>
                  <p className="text-gray-600">
                    Analyze your financial patterns with our comprehensive
                    charts and reports
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-xl mb-8 text-emerald-100">
            Start managing your business finances today - it's simple and free!
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold 
                     hover:bg-emerald-50 transform hover:scale-105 transition-all duration-200 
                     shadow-lg hover:shadow-xl"
          >
            Get Started Now →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>
            © {new Date().getFullYear()} Company Financier. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
