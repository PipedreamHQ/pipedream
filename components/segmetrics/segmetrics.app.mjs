import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "segmetrics",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _accountId() {
      return this.$auth.account_id;
    },
    _apiUrl() {
      return "https://import.segmetrics.io/api/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: this._apiKey(),
        },
        ...args,
      });
    },
    async createOrUpdateOrder({
      integrationId, ...args
    }) {
      return this._makeRequest({
        path: `/${this._accountId()}/${integrationId}/invoice`,
        method: "post",
        ...args,
      });
    },
    async createOrUpdateContact({
      integrationId, ...args
    }) {
      return this._makeRequest({
        path: `/${this._accountId()}/${integrationId}/contact`,
        method: "post",
        ...args,
      });
    },
    async createOrUpdateSubscription({
      integrationId, ...args
    }) {
      return this._makeRequest({
        path: `/${this._accountId()}/${integrationId}/subscription`,
        method: "post",
        ...args,
      });
    },
  },
};
