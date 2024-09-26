const SCRAPING_JOB_TYPES = [
  "raw-html",
  "retail",
  "real-estate",
];

const SEARCH_ENGINES = [
  "google",
  "bing",
];

const SEARCH_RESULT_FORMATS = [
  "json",
  "json-html",
  "html",
];

const SCRAPERS = [
  "linkedinProfile",
  "linkedinCompanyProfile",
  "linkedinPost",
  "instagramProfile",
  "instagramPost",
  "instagramHashtag",
  "facebookProfile",
  "facebookPost",
  "facebookOrganization",
  "twitterProfile",
  "twitterSearch",
  "tiktokProfile",
  "tiktokHashtag",
];

const REQUIRES_URL = [
  "linkedinProfile",
  "linkedinCompanyProfile",
  "linkedinPost",
  "instagramPost",
  "facebookProfile",
  "facebookPost",
  "facebookOrganization",
  "twitterProfile",
  "tiktokProfile",
];

const REQUIRES_ACCOUNT = [
  "instagramProfile",
];

const REQUIRES_SEARCH = [
  "twitterSearch",
];

const REQUIRES_HASHTAG = [
  "instagramHashtag",
  "tiktokHashtag",
];

export default {
  SCRAPING_JOB_TYPES,
  SEARCH_ENGINES,
  SEARCH_RESULT_FORMATS,
  SCRAPERS,
  REQUIRES_URL,
  REQUIRES_ACCOUNT,
  REQUIRES_SEARCH,
  REQUIRES_HASHTAG,
};
