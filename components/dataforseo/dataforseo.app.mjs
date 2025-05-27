import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "dataforseo",
  propDefinitions: {
    locationCode: {
      type: "string",
      label: "Location Code",
      description: "The code of the target location",
      async options() {
        const response = await this.getLocations();
        const languageCodes = response.tasks[0].result;
        return languageCodes.map(({
          location_name, location_code,
        }) => ({
          value: location_code,
          label: location_name,
        }));
      },
    },
    locationCoordinate: {
      type: "string",
      label: "Location Coordinate",
      description:
        "The location to search, in the format `latitude,longitude,radius` where radius is specified in kilometers. Example: `53.476225,-2.243572,200`",

    },
    targetType: {
      type: "string",
      label: "Target Type",
      description: "The type of the target",
      options: constants.TARGET_TYPES,
    },
    target: {
      type: "string",
      label: "Target",
      description: "The domain name or the url of the target website or page",
    },
    backlinksTarget: {
      type: "string",
      label: "Target",
      description:
        "Domain, subdomain or webpage to get data for. A domain or a subdomain should be specified without `https://` and `www`. A page should be specified with absolute URL (including `http://` or `https://`",
    },
    categories: {
      type: "string[]",
      label: "Categories",
      description: "The categories you specify are used to search for business listings",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the business entity for which the results are collected",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The name of the business entity for which the results are collected",
      optional: true,
    },
    isClaimed: {
      type: "boolean",
      label: "Is Claimed",
      description: "Indicates whether the business is verified by its owner on Google Maps",
      optional: true,
    },
    limit: {
      type: "string",
      label: "Limit",
      description: "The maximum number of returned businesses",
      optional: true,
    },
    languageCode: {
      type: "string",
      label: "Language Code",
      description: "The language code for the request",
      async options() {
        const response = await this.getLanguageCode();
        const languageCodes = response.tasks[0].result;
        return languageCodes.map(({
          language_name, language_code,
        }) => ({
          value: language_code,
          label: language_name,
        }));
      },
    },
    keywords: {
      type: "string[]",
      label: "Keywords",
      description: "Target Keywords. The maximum number of keywords is 1000",
    },
    backlinksFilters: {
      type: "string[]",
      label: "Backlinks Filters",
      description:
        "You can use this field to filter the initial backlinks that will be included in the dataset for aggregated metrics for your target. [See the documentation](https://docs.dataforseo.com/v3/backlinks/filters/) for more information. Example: `[\"dofollow\", \"=\", true]`",
      optional: true,
    },
    rankScale: {
      type: "string",
      label: "Rank Scale",
      description:
        "Whether rank values are presented on a 0-100 or 0-1000 scale",
      optional: true,
      options: [
        "one_hundred",
        "one_thousand",
      ],
      default: "one_thousand",
    },
    tag: {
      type: "string",
      label: "Tag",
      description:
        "You can use this parameter to identify the task and match it with the result.",
      optional: true,
    },
    includeSubdomains: {
      type: "boolean",
      label: "Include Subdomains",
      description:
        "Whether the subdomains of the `target` will be included in the search. Default is `true`",
      optional: true,
    },
    includeIndirectLinks: {
      type: "boolean",
      label: "Include Indirect Links",
      description:
        "Whether indirect links to the target will be included in the results. Default is `true`",
      optional: true,
    },
    excludeInternalBacklinks: {
      type: "boolean",
      label: "Exclude Internal Backlinks",
      description:
        "Indicates if internal backlinks from subdomains to the target will be excluded from the results. Default is `true`",
      optional: true,
    },
    backlinksStatusType: {
      type: "string",
      label: "Backlinks Status Type",
      description:
        "You can use this field to choose what backlinks will be returned and used for aggregated metrics for your target",
      optional: true,
      options: [
        {
          value: "all",
          label: "All backlinks will be returned and counted",
        },
        {
          value: "live",
          label:
            "Backlinks found during the last check will be returned and counted",
        },
        {
          value: "lost",
          label: "Lost backlinks will be returned and counted",
        },
      ],
      default: "live",
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description: "Additional parameters to send in the request. See the documentation for all available parameters. Values will be parsed as JSON where applicable.",
      optional: true,
    },
    targets: {
      type: "string[]",
      label: "Targets",
      description: "Up to 1000 domains, subdomains or webpages to get data for. A domain or a subdomain should be specified without `https://` and `www`. A page should be specified with absolute URL (including `http://` or `https://`",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.dataforseo.com/v3";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        auth: {
          username: `${this.$auth.api_login}`,
          password: `${this.$auth.api_password}`,
        },
      });
    },
    async getKeywordDifficulty(args = {}) {
      return this._makeRequest({
        path: "/dataforseo_labs/google/bulk_keyword_difficulty/live",
        method: "post",
        ...args,
      });
    },
    async getBusinessListings(args = {}) {
      return this._makeRequest({
        path: "/business_data/business_listings/search/live",
        method: "post",
        ...args,
      });
    },
    async getRankedKeywords(args = {}) {
      return this._makeRequest({
        path: "/keywords_data/google_ads/keywords_for_site/live",
        method: "post",
        ...args,
      });
    },
    async getLanguageCode(args = {}) {
      return this._makeRequest({
        path: "/keywords_data/google_ads/languages",
        ...args,
      });
    },
    async getLocations(args = {}) {
      return this._makeRequest({
        path: "/serp/google/ads_search/locations",
        ...args,
      });
    },
  },
};
