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

// V3 prospecting pagination limits: `pagination.size` is 10-100 and `pagination.page` is 0-1000.
// https://docs.lusha.com/apis/openapi/prospecting
export const PAGE_SIZE = 100;
export const MAX_PAGE = 1000;

// V3 enrich and search-and-enrich endpoints accept at most 100 IDs or identifiers per request.
export const MAX_ITEMS_PER_REQUEST = 100;

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
