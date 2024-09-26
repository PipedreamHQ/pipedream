const BASE_URL = "https://api.openweathermap.org";

const GEO_PATH = "/geo";
const GEO_VERSION_PATH = "/1.0";

const WEATHER_PATH = "/data";
const WEATHER_VERSION_PATH = "/2.5";

const FORECAST_PATH = "/data";
const FORECAST_VERSION_PATH = "/2.5/forecast";

const CATEGORIES = {
  GEO: 1,
  WEATHER: 2,
  FORECAST: 3,
};

const LANGUAGES = {
  af: "Afrikaans",
  al: "Albanian",
  ar: "Arabic",
  az: "Azerbaijani",
  bg: "Bulgarian",
  ca: "Catalan",
  cz: "Czech",
  da: "Danish",
  de: "German",
  el: "Greek",
  en: "English",
  eu: "Basque",
  fa: "Persian (Farsi)",
  fi: "Finnish",
  fr: "French",
  gl: "Galician",
  he: "Hebrew",
  hi: "Hindi",
  hr: "Croatian",
  hu: "Hungarian",
  id: "Indonesian",
  it: "Italian",
  ja: "Japanese",
  kr: "Korean",
  la: "Latvian",
  lt: "Lithuanian",
  mk: "Macedonian",
  no: "Norwegian",
  nl: "Dutch",
  pl: "Polish",
  pt: "Portuguese",
  pt_br: "Português Brasil",
  ro: "Romanian",
  ru: "Russian",
  sv: "Swedish -sv",
  se: "Swedish -se",
  sk: "Slovak",
  sl: "Slovenian",
  sp: "Spanish -sp",
  es: "Spanish -es",
  sr: "Serbian",
  th: "Thai",
  tr: "Turkish",
  ua: "Ukrainian -ua",
  uk: "Ukrainian -uk",
  vi: "Vietnamese",
  zh_cn: "Chinese Simplified",
  zh_tw: "Chinese Traditional",
  zu: "Zulu",
};

export default {
  BASE_URL,
  GEO_PATH,
  GEO_VERSION_PATH,
  WEATHER_PATH,
  WEATHER_VERSION_PATH,
  FORECAST_PATH,
  FORECAST_VERSION_PATH,
  CATEGORIES,
  LANGUAGES,
};
