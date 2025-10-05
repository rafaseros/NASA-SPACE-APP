import React from "react";
import { Rocket, Clock, Microscope } from "lucide-react";
import { useTranslation } from "react-i18next";

const ComingSoon: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full mb-6">
            <Rocket className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {t("comingSoon.title")}
          </h1>
          <p className="text-xl text-gray-300 mb-8">{t("comingSoon.desc")}</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 mb-8">
          <div className="flex items-center justify-center mb-6">
            <Clock className="w-8 h-8 text-yellow-400 mr-3" />
            <h2 className="text-2xl font-semibold text-white">
              {t("comingSoon.inDev")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Microscope className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {t("comingSoon.researchTitle")}
              </h3>
              <p className="text-gray-400 text-sm">
                {t("comingSoon.researchDesc")}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {t("comingSoon.devTitle")}
              </h3>
              <p className="text-gray-400 text-sm">{t("comingSoon.devDesc")}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {t("comingSoon.testTitle")}
              </h3>
              <p className="text-gray-400 text-sm">
                {t("comingSoon.testDesc")}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              {t("comingSoon.whatToExpect")}
            </h3>
            <ul className="text-gray-300 text-sm space-y-2 text-left max-w-md mx-auto">
              <li>• Simulaciones basadas en experimentos reales de la EEI</li>
              <li>• Interfaz interactiva con datos científicos precisos</li>
              <li>• Múltiples niveles de dificultad</li>
              <li>• Contenido educativo integrado</li>
              <li>• Logros y estadísticas de progreso</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200">
            {t("comingSoon.notify")}
          </button>
          <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-200">
            {t("comingSoon.viewOthers")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
