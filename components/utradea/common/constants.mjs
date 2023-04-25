const BASE_URL = "http://cloud.utradea.com";
const VERSION_PATH = "/v1";
const LAST_END_TS = "lastEndTs";

const TIMEFRAME = {
  ["15m"]: {
    value: "15m",
    label: "15 Minutes",
  },
  ["30m"]: {
    value: "30m",
    label: "30 Minutes",
  },
  ["1H"]: {
    value: "1h",
    label: "1 Hour",
  },
  ["4H"]: {
    value: "4h",
    label: "4 Hours",
  },
  ["1D"]: {
    value: "1d",
    label: "1 Day",
  },
  ["24H"]: {
    value: "24h",
    label: "24 Hours",
  },
  ["72H"]: {
    value: "72h",
    label: "72 Hours",
  },
  ["1W"]: {
    value: "1w",
    label: "1 Week",
  },
  ["2W"]: {
    value: "2w",
    label: "2 Weeks",
  },
  ["1M"]: {
    value: "1m",
    label: "1 Month",
  },
  ["3M"]: {
    value: "3m",
    label: "3 Months",
  },
};

const SOCIAL_MEDIA = {
  TWITTER: "twitter",
  STOCKTWITS: "stocktwits",
};

const SENTIMENT = {
  BULLISH: "bullish",
  BEARISH: "bearish",
};

export default {
  BASE_URL,
  VERSION_PATH,
  LAST_END_TS,
  TIMEFRAME,
  SOCIAL_MEDIA,
  SENTIMENT,
};
