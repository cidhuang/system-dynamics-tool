var en = require("./translations.en.json");
var zh = require("./translations.zh.json");

const i18n = {
  translations: {
    en,
    zh,
  },
  defaultLang: "zh",
  useBrowserDefault: true,
  // optional property will default to "query" if not set
  languageDataStore: "query" || "localStorage",
  useBrowserDefault: true,
};

module.exports = i18n;