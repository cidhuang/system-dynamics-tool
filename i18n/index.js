var en = require("./translations.en.json");
var fr = require("./translations.fr.json");

const i18n = {
  translations: {
    en,
    fr,
  },
  defaultLang: "en",
  useBrowserDefault: true,
  // optional property will default to "query" if not set
  languageDataStore: "query" || "localStorage",
};

module.exports = i18n;