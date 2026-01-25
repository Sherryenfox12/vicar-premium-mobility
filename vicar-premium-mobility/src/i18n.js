import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "./locales/en_translation.json";
import zhTranslation from "./locales/zh_translation.json";

i18n
  .use(LanguageDetector) // detect language
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      zh: { translation: zhTranslation }
    },
    fallbackLng: "en", // default
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"], // check storage first
      caches: ["localStorage"], // save user choice
    },
  });

export default i18n;
