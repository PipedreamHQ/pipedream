import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "l3mbda",
  propDefinitions: {
    from: {
      label: "Sender (Address)",
      type: "string",
      description: "Enter to filter transactions by their from (sender) field. Accepts ENS.",
      optional: true,
    },
    to: {
      label: "Recipient (Address)",
      type: "string",
      description: "Enter to filter transactions by their to (receiver) field. Accepts ENS.",
      optional: true,
    },
    token: {
      label: "Token Contract (Address)",
      type: "string",
      description: "Enter to filter transactions by token.",
      optional: true,
    },
    amount: {
      label: "Amount (Token)",
      type: "string",
      description: "Enter to filter transactions by their minimum amount in tokens.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://l3mbda.com/integrations/pipedream";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    makeRequest({
      $ = this, path, ...args
    }) {
      const config = {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...args,
      };
      return axios($, config);
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    delete(args = {}) {
      return this.makeRequest({
        method: "delete",
        ...args,
      });
    },
  },
};
