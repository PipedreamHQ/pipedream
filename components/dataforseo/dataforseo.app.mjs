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
      description: "The coordinate of the target location. It should be specified in the “latitude,longitude,radius” format, i.e.: `53.476225,-2.243572,200`",
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
