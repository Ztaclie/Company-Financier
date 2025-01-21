import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const DashboardLayout = ({ children, onSignOut }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigation = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Transactions", path: "/transactions", icon: "💰" },
    { name: "Reports", path: "/reports", icon: "📈" },
    { name: "Settings", path: "/settings", icon: "⚙️" },
  ];

  const handleSignOut = () => {
    onSignOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            {/* Logo and Navigation Links */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link
                  to="/dashboard"
                  className="text-xl font-bold text-emerald-600"
                >
                  Company Financier
                </Link>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium
                      ${
                        location.pathname === item.path
                          ? "text-emerald-600 border-b-2 border-emerald-600"
                          : "text-gray-500 hover:text-emerald-600 hover:border-b-2 hover:border-emerald-600"
                      }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Profile Dropdown */}
            <div className="flex items-center">
              <div className="ml-3 relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-lg hover:bg-emerald-100"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    👤
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    My Profile
                  </span>
                </button>

                {showProfileMenu && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="flex justify-around p-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`inline-flex flex-col items-center px-3 py-2 text-xs font-medium
                  ${
                    location.pathname === item.path
                      ? "text-emerald-600"
                      : "text-gray-500 hover:text-emerald-600"
                  }`}
              >
                <span className="text-xl mb-1">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {navigation.find((item) => item.path === location.pathname)?.name ||
              "Dashboard"}
          </h1>
        </div>

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
