import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "google_safebrowsing",
  propDefinitions: {
    threatTypes: {
      type: "string[]",
      label: "Threat Types",
      description: "The threat types to be checked",
      async options() {
        const { threatLists } = await this.getThreatLists();
        return [
          ...new Set(threatLists.map(({ threatType }) => threatType)),
        ];
      },
    },
    platformTypes: {
      type: "string[]",
      label: "Platform Types",
      description: "The platform types to be checked",
      async options({ threatTypes }) {
        const { threatLists } = await this.getThreatLists();
        return [
          ...new Set(threatLists
            .filter(({ threatType }) => !threatTypes || threatTypes.includes(threatType))
            .map(({ platformType }) => platformType)),
        ];
      },
    },
    threatEntryTypes: {
      type: "string[]",
      label: "Threat Entry Types",
      description: "The entry types to be checked",
      async options({
        threatTypes, platformTypes,
      }) {
        const { threatLists } = await this.getThreatLists();
        return [
          ...new Set(threatLists
            .filter(({
              threatType, platformType,
            }) =>
              (!threatTypes || threatTypes.includes(threatType)) &&
              (!platformTypes || platformTypes.includes(platformType)))
            .map(({ threatEntryType }) => threatEntryType)),
        ];
      },
    },
    threatLists: {
      type: "string[]",
      label: "Threat Lists",
      description: "The threat lists to check for updates",
      async options() {
        const { threatLists } = await this.getThreatLists();
        return threatLists.map((list) => ({
          label: `${list.threatType} / ${list.platformType} / ${list.threatEntryType}`,
          value: JSON.stringify(list),
        }));
      },
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
    getThreatLists(args = {}) {
      return this._makeRequest({
        path: "/threatLists",
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
    fetchThreatListUpdates(args = {}) {
      return this._makeRequest({
        path: "/threatListUpdates:fetch",
        method: "POST",
        ...args,
      });
    },
  },
};
