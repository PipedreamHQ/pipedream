export const SIGNALS_OPTIONS = [
  {
    label: "All Signals",
    value: "allSignals",
  },
  {
    label: "Promotion",
    value: "promotion",
  },
  {
    label: "Company Changes",
    value: "companyChange",
  },
];

export const COMPANY_SIGNALS_OPTIONS = [
  {
    label: "All Signals",
    value: "allSignals",
  },
  {
    label: "Headcount Growth",
    value: "headcountGrowth",
  },
  {
    label: "New Jobs Open",
    value: "newJobsOpen",
  },
  {
    label: "News Event",
    value: "newsEvent",
  },
];

// Signal types accepted by POST /v3/companies/signals. `allSignals` excludes the four intent
// types (newIntentTopic, intentScoreIncrease, intentScoreDecrease, intentTopicRemoved).
// https://docs.lusha.com/api-reference/signals/company-signals
export const V3_COMPANY_SIGNAL_TYPES = [
  "allSignals",
  "linkedinActivityIntent",
  "newIntentTopic",
  "intentScoreIncrease",
  "intentScoreDecrease",
  "intentTopicRemoved",
  "websiteTrafficIncrease",
  "websiteTrafficDecrease",
  "itSpendIncrease",
  "itSpendDecrease",
  "linkedinFollowersIncrease",
  "linkedinFollowersDecrease",
  "surgeInHiring",
  "surgeInHiringByDepartment",
  "surgeInHiringByLocation",
  "headcountIncrease1m",
  "headcountIncrease3m",
  "headcountIncrease6m",
  "headcountIncrease12m",
  "headcountDecrease1m",
  "headcountDecrease3m",
  "headcountDecrease6m",
  "headcountDecrease12m",
  "riskNews",
  "commercialActivityNews",
  "corporateStrategyNews",
  "financialEventsNews",
  "peopleNews",
  "marketIntelligenceNews",
  "productActivityNews",
];

// V3 prospecting pagination limits: `pagination.size` is 10-100 and `pagination.page` is 0-1000.
// https://docs.lusha.com/apis/openapi/prospecting
export const PAGE_SIZE = 100;
export const MIN_PAGE_SIZE = 10;
export const MAX_PAGE = 1000;

// V3 enrich, search-and-enrich and signals endpoints accept at most 100 IDs
// or identifiers per request.
export const MAX_ITEMS_PER_REQUEST = 100;

// Data Waterfall enrich jobs: total time to keep polling before returning what is already known.
// https://docs.lusha.com/api-reference/enrich/get-contacts-enrich-job
export const MAX_JOB_WAIT_MS = 60000;

export const CONTACT_REVEAL_OPTIONS = [
  {
    label: "Emails",
    value: "emails",
  },
  {
    label: "Phones",
    value: "phones",
  },
];
