import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "buysellads",
  propDefinitions: {
    lineItemId: {
      type: "string",
      label: "Line Item ID",
      description: "The ID of a line item",
      optional: true,
      async options() {
        const lineitems = await this.listLineItems();
        return lineitems?.map((lineitem) => ({
          label: lineitem.lineitem_name,
          value: lineitem.lineitem_id,
        })) || [];
      },
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date in `yyyy-mm-dd` format",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date in `yyyy-mm-dd` format",
      optional: true,
    },
    csvOutput: {
      type: "boolean",
      label: "CSV Output",
      description: "Whether to return the response as CSV output",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://papi.buysellads.com";
    },
    _makeRequest({
      $ = this, path, params = {}, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          key: this.$auth.api_key,
        },
        ...opts,
      });
    },
    listLineItems(opts = {}) {
      return this._makeRequest({
        path: "/lineitems",
        ...opts,
      });
    },
    listDailyStats(opts = {}) {
      return this._makeRequest({
        path: "/daily-stats",
        ...opts,
      });
    },
    listCreatives(opts = {}) {
      return this._makeRequest({
        path: "/creatives",
        ...opts,
      });
    },
    listCreativesDailyStats(opts = {}) {
      return this._makeRequest({
        path: "/creatives-daily-stats",
        ...opts,
      });
    },
  },
};
