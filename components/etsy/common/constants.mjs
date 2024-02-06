const BASE_URL = "https://openapi.etsy.com";
const VERSION_PATH = "/v3";
const DEFAULT_MAX = 600;
const DEFAULT_LIMIT = 100;

const WHO_MADE_OPTIONS = [
  {
    label: "I Did",
    value: "i_did",
  },
  {
    label: "Collective",
    value: "collective",
  },
  {
    label: "Someone Else",
    value: "someone_else",
  },
];

const WHEN_MADE_OPTIONS = [
  {
    label: "Made to Order",
    value: "made_to_order",
  },
  {
    label: "2020 - 2023",
    value: "2020_2023",
  },
  {
    label: "2010 - 2019",
    value: "2010_2019",
  },
  {
    label: "2004 - 2009",
    value: "2004_2009",
  },
  {
    label: "Before 2004",
    value: "before_2004",
  },
  {
    label: "2000 - 2003",
    value: "2000_2003",
  },
  {
    label: "1990s",
    value: "1990s",
  },
  "1980s",
  "1970s",
  "1960s",
  "1950s",
  "1940s",
  "1930s",
  "1920s",
  "1910s",
  "1900s",
  "1800s",
  "1700s",
  {
    label: "Before 1700",
    value: "before_1700",
  },
];

const TAXONOMY_TYPE = {
  SELLER: "seller",
  BUYER: "buyer",
};

const LISTING_TYPE = {
  PHYSICAL: "physical",
  DOWNLOAD: "download",
  BOTH: "both",
};

const LISTING_STATE = {
  active: "active",
  INACTIVE: "inactive",
  SOLD_OUT: "sold_out",
  DRAFT: "draft",
  EXPIRED: "expired",
};

export default {
  BASE_URL,
  VERSION_PATH,
  DEFAULT_LIMIT,
  DEFAULT_MAX,
  WHO_MADE_OPTIONS,
  WHEN_MADE_OPTIONS,
  TAXONOMY_TYPE,
  LISTING_TYPE,
  LISTING_STATE,
};
