import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "callrail",
  methods: {
    _baseUrl() {
      return "https://api.callrail.com/v3/a";
    },
    _headers() {
      return {
        "Authorization": `Token token=${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    getAccounts(args = {}) {
      return this._makeRequest({
        path: ".json",
        ...args,
      });
    },
    createHook({
      accountId,
      ...args
    }) {
      return this._makeRequest({
        path: `/${accountId}/integrations.json`,
        method: "POST",
        ...args,
      });
    },
    deleteHook({
      accountId,
      webhookId,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/${accountId}/integrations/integrations/${webhookId}.json`,
      });
    },
  },
};
