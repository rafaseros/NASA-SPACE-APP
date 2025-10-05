import React from "react";
import { Link } from "react-router-dom";
import {
  Rocket,
  Leaf,
  Microscope,
  BookOpen,
  Settings,
  Info,
  Globe,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const MainMenu: React.FC = () => {
  const { t, i18n } = useTranslation();

  const experiments = [
    {
      id: "zinnia",
      title: t("menu.zinniaTitle"),
      description: t("menu.zinniaDesc"),
      icon: Leaf,
      path: "/zinnia",
      status: "available",
      difficulty: t("menu.difficulty.intermediate"),
      duration: "5 min",
      category: t("menu.zinniaCategory"),
    },
    {
      id: "crystal-growth",
      title: t("menu.crystalsTitle"),
      description: t("menu.crystalsDesc"),
      icon: Microscope,
      path: "/crystal-growth",
      status: "coming-soon",
      difficulty: t("menu.difficulty.advanced"),
      duration: "10 min",
      category: t("menu.crystalsCategory"),
    },
    {
      id: "fluid-dynamics",
      title: t("menu.fluidsTitle"),
      description: t("menu.fluidsDesc"),
      icon: Rocket,
      path: "/fluid-dynamics",
      status: "coming-soon",
      difficulty: t("menu.difficulty.expert"),
      duration: "15 min",
      category: t("menu.fluidsCategory"),
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
            {t("menu.status.available")}
          </span>
        );
      case "coming-soon":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5"></div>
            {t("menu.status.coming")}
          </span>
        );
      default:
        return null;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Intermedio":
        return "text-blue-600 bg-blue-100";
      case "Avanzado":
        return "text-orange-600 bg-orange-100";
      case "Experto":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      {/* Header - Mobile Optimized */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Rocket className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">
                  {t("menu.appTitle")}
                </h1>
                <p className="text-xs text-gray-400 hidden sm:block">
                  Estación Espacial Internacional
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors">
                <Info className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button className="p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                className="p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors"
                onClick={() =>
                  i18n.changeLanguage(i18n.language === "es" ? "en" : "es")
                }
                title={
                  i18n.language === "es"
                    ? "Switch to English"
                    : "Cambiar a Español"
                }
              >
                <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Mobile First */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Hero Section - Mobile Optimized */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4 sm:mb-6">
            <Rocket className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
            {t("menu.heroTitle")}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
            {t("menu.heroDesc")}
          </p>
        </div>

        {/* Experiments Grid - Mobile First */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
          {experiments.map((experiment) => {
            const IconComponent = experiment.icon;
            const isAvailable = experiment.status === "available";

            return (
              <div
                key={experiment.id}
                className={`group relative bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden transition-all duration-300 ${
                  isAvailable
                    ? "hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer"
                    : "opacity-75 cursor-not-allowed"
                }`}
              >
                {/* Status Badge */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                  {getStatusBadge(experiment.status)}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-start mb-3 sm:mb-4 pr-16 sm:pr-20">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0 ${
                        isAvailable
                          ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                          : "bg-gray-600"
                      }`}
                    >
                      <IconComponent
                        className={`w-5 h-5 sm:w-6 sm:h-6 ${
                          isAvailable ? "text-white" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-1 line-clamp-1">
                        {experiment.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400 line-clamp-1">
                        {experiment.category}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-3 sm:mb-4 text-sm leading-relaxed line-clamp-2">
                    {experiment.description}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                          experiment.difficulty
                        )}`}
                      >
                        {experiment.difficulty}
                      </span>
                      <span className="text-xs text-gray-400">
                        ⏱️ {experiment.duration}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {isAvailable ? (
                    <Link
                      to={experiment.path}
                      className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-200 text-center text-sm sm:text-base group-hover:shadow-lg group-hover:shadow-blue-500/25"
                    >
                      {t("menu.startExperiment")}
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-600 text-gray-400 font-medium py-2.5 sm:py-3 px-4 rounded-lg cursor-not-allowed text-sm sm:text-base"
                    >
                      {t("common.comingSoon")}
                    </button>
                  )}
                </div>

                {/* Hover Effect */}
                {isAvailable && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Educational Section - Mobile Optimized */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                {t("menu.learnTitle")}
              </h3>
              <p className="text-gray-300 mb-4 text-sm sm:text-base leading-relaxed">
                {t("menu.learnDesc")}
              </p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="px-2 sm:px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs sm:text-sm whitespace-nowrap">
                  {t("menu.tags.microgravity")}
                </span>
                <span className="px-2 sm:px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs sm:text-sm whitespace-nowrap">
                  {t("menu.tags.biology")}
                </span>
                <span className="px-2 sm:px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs sm:text-sm whitespace-nowrap">
                  {t("menu.tags.fluids")}
                </span>
                <span className="px-2 sm:px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs sm:text-sm whitespace-nowrap">
                  {t("menu.tags.crystallography")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Mobile Optimized */}
      <footer className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-700/50 mt-8 sm:mt-12 lg:mt-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
          <div className="text-center">
            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
              {t("menu.footer")}
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <a
                href="https://www.nasa.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
              >
                {t("common.nasa")}
              </a>
              <a
                href="https://www.esa.int"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
              >
                {t("common.esa")}
              </a>
              <a
                href="https://www.jaxa.jp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
              >
                {t("common.jaxa")}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainMenu;
