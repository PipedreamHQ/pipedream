import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "vestaboard",
  propDefinitions: {
    subscriptionId: {
      type: "string",
      label: "Subscription",
      description: "The ID of the Subscription to which to post",
      async options() {
        const { subscriptions } = await this.listSubscriptions();
        return subscriptions?.map(({
          _id, title,
        }) => ({
          label: title || _id,
          value: _id,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://platform.vestaboard.com/v2.0";
    },
    _headers() {
      return {
        "X-Vestaboard-Api-Key": this.$auth.api_key,
        "X-Vestaboard-Api-Secret": this.$auth.api_secret,
      };
    },
    async _makeRequest({
      $ = this,
      url,
      headers,
      path,
      ...args
    }) {
      return axios($, {
        url: url || `${this._baseUrl()}${path}`,
        headers: headers || this._headers(),
        ...args,
      });
    },
    async getCurrentMessage(args = {}) {
      return this._makeRequest({
        url: "https://rw.vestaboard.com",
        headers: {
          "X-Vestaboard-Read-Write-Key": this.$auth.readwrite_api_key,
        },
        ...args,
      });
    },
    listSubscriptions(args = {}) {
      return this._makeRequest({
        path: "/subscriptions",
        ...args,
      });
    },
    createMessage({
      subscriptionId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/subscriptions/${subscriptionId}/message`,
        method: "POST",
        ...args,
      });
    },
  },
};
