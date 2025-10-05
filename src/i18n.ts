import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import es from "./locales/es/translation.json";
import en from "./locales/en/translation.json";

const savedLng = typeof window !== "undefined" ? localStorage.getItem("lng") : null;
const browserLng = typeof navigator !== "undefined" ? navigator.language.split("-")[0] : "es";

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en }
  },
  lng: savedLng || browserLng || "es",
  fallbackLng: "es",
  interpolation: { escapeValue: false }
});

i18n.on("languageChanged", (lng) => {
  try {
    localStorage.setItem("lng", lng);
  } catch {}
});

export default i18n;


