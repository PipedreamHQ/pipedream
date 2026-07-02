import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "microsoft_clarity",
  propDefinitions: {
    numOfDays: {
      type: "string",
      label: "Time Range",
      description: "The time window for the analytics data.",
      options: [
        {
          label: "Last 24 hours",
          value: "1",
        },
        {
          label: "Last 48 hours",
          value: "2",
        },
        {
          label: "Last 72 hours",
          value: "3",
        },
      ],
    },
    dimension: {
      type: "string",
      label: "Dimension",
      description: "A dimension to group the analytics data by. Valid values: `Browser`, `Device`, `Country/Region`, `OS`, `Source`, `Medium`, `Campaign`, `Channel`, `URL`.",
      optional: true,
      options: [
        "Browser",
        "Device",
        "Country/Region",
        "OS",
        "Source",
        "Medium",
        "Campaign",
        "Channel",
        "URL",
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.clarity.ms/export-data/api/v1";
    },
    _makeRequest({
      $ = this, path, headers: callerHeaders = {}, ...opts
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        url: path,
        headers: {
          Authorization: `Bearer ${this.$auth.api_token}`,
          ...callerHeaders,
        },
        ...opts,
      });
    },
    getLiveInsights({
      $, numOfDays, dimension1, dimension2, dimension3,
    }) {
      return this._makeRequest({
        $,
        path: "/project-live-insights",
        params: {
          numOfDays,
          dimension1,
          dimension2,
          dimension3,
        },
      });
    },
  },
};
