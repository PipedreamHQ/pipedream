const BASE_URL = "https://privatusanalytics.com";
const DOCS_URL = "https://privatusanalytics.com/docs/api";

/** Seconds a webhook signature stays valid. The webhooks documentation asks for five minutes. */
const SIGNATURE_TOLERANCE = 300;
const SIGNATURE_HEADER = "privatus-signature";

const PER_PAGE = 100;
const DEFAULT_MAX_RESULTS = 100;

const PERIOD_OPTIONS = [
  {
    label: "Today",
    value: "today",
  },
  {
    label: "Yesterday",
    value: "yesterday",
  },
  {
    label: "Last 24 Hours",
    value: "24h",
  },
  {
    label: "Last 7 Days",
    value: "7d",
  },
  {
    label: "Last 14 Days",
    value: "14d",
  },
  {
    label: "Last 28 Days",
    value: "28d",
  },
  {
    label: "Last 30 Days",
    value: "30d",
  },
  {
    label: "Last 90 Days",
    value: "90d",
  },
  {
    label: "Month to Date",
    value: "mtd",
  },
  {
    label: "Last Month",
    value: "last_month",
  },
  {
    label: "Quarter to Date",
    value: "qtd",
  },
  {
    label: "Last Quarter",
    value: "last_quarter",
  },
  {
    label: "Year to Date",
    value: "ytd",
  },
  {
    label: "Last 12 Months",
    value: "12mo",
  },
  {
    label: "Last Year",
    value: "last_year",
  },
  {
    label: "All Time",
    value: "all",
  },
  {
    label: "Custom (use From and To)",
    value: "custom",
  },
];

const CHART_NOTE_COLORS = [
  "neutral",
  "brand",
  "blue",
  "amber",
  "red",
  "violet",
];

const CHART_NOTE_SOURCES = [
  "manual",
  "deploy",
  "system",
  "import",
  "incident",
];

export default {
  BASE_URL,
  DOCS_URL,
  SIGNATURE_TOLERANCE,
  SIGNATURE_HEADER,
  PER_PAGE,
  DEFAULT_MAX_RESULTS,
  PERIOD_OPTIONS,
  CHART_NOTE_COLORS,
  CHART_NOTE_SOURCES,
};
