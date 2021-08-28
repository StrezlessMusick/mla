import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { i18n as i18nConfig } from "../../next-i18next.config";
import lastfm from "../../public/locales/en/lastfm.json";
import main from "../../public/locales/en/main.json";
import navbar from "../../public/locales/en/navbar.json";

i18n.use(initReactI18next).init({
  ...i18nConfig,
  debug: false,
  resources: {
    en: {
      main,
      navbar,
      lastfm,
    },
  },
});

global.i18n = i18n;