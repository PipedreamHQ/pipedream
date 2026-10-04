import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "serpkite",
  propDefinitions: {
    q: {
      type: "string",
      label: "Query",
      description: "The search query.",
    },
    country: {
      type: "string",
      label: "Country",
      description: "Two-letter country code used to localize results, such as us or gb.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Language code for results, such as en or de.",
      optional: true,
    },
    num: {
      type: "integer",
      label: "Number of Results",
      description: "Requested results, from 1 to 100. Counts round up to whole pages. Depth requests cost 1 credit per fetched page, capped at 7 credits for 100 results.",
      default: 10,
      min: 1,
      max: 100,
      optional: true,
    },
    time: {
      type: "string",
      label: "Time Window",
      description: "Restrict results to the selected time window.",
      optional: true,
      options: [
        "hour",
        "day",
        "week",
        "month",
        "year",
      ],
    },
  },
  methods: {
    async _makeRequest({
      $, path, method = "GET", params, data,
    }) {
      return axios($, {
        method,
        url: `https://api.serpkite.com/v1/${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
        params,
        data,
      });
    },
    async search(args) {
      return this._makeRequest({
        ...args,
        path: "search",
      });
    },
    async news(args) {
      return this._makeRequest({
        ...args,
        path: "news",
      });
    },
    async webpage(args) {
      return this._makeRequest({
        ...args,
        path: "webpage",
        method: "POST",
      });
    },
  },
};
