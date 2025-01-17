import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { useState } from "react";

// Placeholder components - we'll create these files next
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import LandingPage from "./pages/LandingPage";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const Navbar = () => (
    <nav className="bg-emerald-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold">
          Company Financier
        </Link>
        <div className="space-x-4">
          <Link to="/dashboard" className="hover:text-emerald-200">
            Dashboard
          </Link>
          <Link to="/transactions" className="hover:text-emerald-200">
            Transactions
          </Link>
          <Link to="/reports" className="hover:text-emerald-200">
            Reports
          </Link>
          <Link to="/settings" className="hover:text-emerald-200">
            Settings
          </Link>
        </div>
      </div>
    </nav>
  );

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage onGetStarted={() => setIsAuthenticated(true)} />
          }
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/transactions"
          element={isAuthenticated ? <Transactions /> : <Navigate to="/" />}
        />
        <Route
          path="/reports"
          element={isAuthenticated ? <Reports /> : <Navigate to="/" />}
        />
        <Route
          path="/settings"
          element={isAuthenticated ? <Settings /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
