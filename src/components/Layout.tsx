import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ArrowLeft, Home, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Layout: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const isMainMenu = location.pathname === "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      {/* Navigation Bar - Mobile First */}
      {!isMainMenu && (
        <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="flex items-center justify-between h-12 sm:h-14">
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-4">
                <Link
                  to="/"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {t("common.backToMenu")}
                  </span>
                </Link>
                <div className="h-4 w-px bg-gray-600"></div>
                <Link
                  to="/"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {t("common.home")}
                  </span>
                </Link>
              </div>

              {/* Mobile Navigation Title */}
              <div className="lg:hidden flex-1 text-center">
                <h1 className="text-sm font-semibold text-white truncate">
                  {location.pathname === "/zinnia"
                    ? t("layout.zinnia")
                    : t("layout.experiment")}
                </h1>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400 hidden sm:block">
                  {t("common.online")}
                </span>
              </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
              <div className="lg:hidden border-t border-gray-700/50 bg-gray-800/80 backdrop-blur-sm">
                <div className="px-3 py-4 space-y-3">
                  <Link
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors py-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {t("common.backToMenu")}
                    </span>
                  </Link>
                  <Link
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors py-2"
                  >
                    <Home className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {t("common.home")}
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={isMainMenu ? "" : "pt-0"}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
