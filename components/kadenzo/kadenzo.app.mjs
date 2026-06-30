import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "kadenzo",
  propDefinitions: {
    accountIds: {
      type: "string[]",
      label: "Accounts",
      description: "The connected social accounts to post to.",
      async options() {
        const { accounts = [] } = await this.listAccounts();
        return accounts
          .filter((a) => a.is_active)
          .map((a) => ({
            label: `${a.platform} — ${a.username}${a.label ? ` (${a.label})` : ""}`,
            value: a.id,
          }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://studio.kadenzo.app/api/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({ $ = this, path, headers, ...opts }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...this._headers(),
          ...headers,
        },
        ...opts,
      });
    },
    listAccounts($) {
      return this._makeRequest({ $, path: "/accounts" });
    },
    schedulePost({ $, data }) {
      return this._makeRequest({ $, method: "POST", path: "/posts", data });
    },
  },
};
