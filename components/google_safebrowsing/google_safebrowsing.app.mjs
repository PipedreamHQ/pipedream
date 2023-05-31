import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "google_safebrowsing",
  propDefinitions: {
    threatTypes: {
      type: "string[]",
      label: "Threat Types",
      description: "The threat types to be checked",
      options: constants.THREAT_TYPES,
    },
    platformTypes: {
      type: "string[]",
      label: "Platform Types",
      description: "The platform types to be checked",
      options: constants.PLATFORM_TYPES,
    },
    threatEntryTypes: {
      type: "string[]",
      label: "Threat Entry Types",
      description: "The entry types to be checked",
      options: constants.THREAT_ENTRY_TYPES,
    },
  },
  methods: {
    _baseUrl() {
      return "https://safebrowsing.googleapis.com/v4";
    },
    async _makeRequest({
      $ = this,
      path,
      params = {},
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          key: this.$auth.api_key,
        },
        ...args,
      });
    },
    findThreatMatches(args = {}) {
      return this._makeRequest({
        path: "/threatMatches:find",
        method: "POST",
        ...args,
      });
    },
  },
};
