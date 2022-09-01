import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translation_en from "./en.json";
import translation_zh from "./zh.json";

const resources = {
  en: {
    translation: translation_en,
  },
  zh: {
    translation: translation_zh,
  },
};

i18n.use(initReactI18next).init({
  resources, // 引用多語系文檔
  lng: "zh", // 預設語言為中文(zh)
  interpolation: {
    escapeValue: false, // React本身就具有防止XSS攻擊的機制
  },
});

export default i18n;
