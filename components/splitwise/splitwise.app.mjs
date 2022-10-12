import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "splitwise",
  propDefinitions: {
    group: {
      type: "integer",
      label: "Group",
      description: "Filter by a specific group.",
    },
    friend: {
      type: "integer",
      label: "Friend",
      description: "Filter by a specific friend that are not in any group.",
    },
    datedAfter: {
      type: "string",
      label: "Dated After",
      description: "ISO 8601 Datetime. Return expenses after this date.",
      optional: true,
    },
    datedBefore: {
      type: "string",
      label: "Dated Before",
      description: "ISO 8601 Date time. Return expenses earlier this date.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "How many expenses to fetch. Defaults to fetch all.",
      optional: true,
    },
  },
  methods: {
    baseUrl() {
      return "https://secure.splitwise.com/api/v3.0";
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this.baseUrl() + path,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    async getExpenses(opts = {}) {
      const path = "/get_expenses";
      const { expenses } = await this._makeRequest({
        ...opts,
        path,
      });
      return expenses;
    },
  },
};
