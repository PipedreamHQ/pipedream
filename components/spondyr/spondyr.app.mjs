import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "spondyr",
  propDefinitions: {
    eventType: {
      type: "string",
      label: "Event Type",
      description: "The Spondyr Event Type",
      async options({
        page, transactionType,
      }) {
        const { Data } = await this.listEventTypes({
          params: {
            page,
            transactionType,
          },
        });

        return Data.map((item) => (item.Name));
      },
    },
    transactionType: {
      type: "string",
      label: "Transaction Type",
      description: "The Spondyr Transaction Type",
      async options({ page }) {
        const { Data } = await this.listTransactionTypes({
          params: {
            page,
          },
        });

        return Data.map((item) => (item.Name));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://client.spondyr.io/api/v1.0.0";
    },
    _getHeaders() {
      return {
        "APIKey": this.$auth.api_key,
        "ApplicationToken": this.$auth.app_token,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };
      return axios($, config);
    },
    createSpondyr({
      $, ...data
    }) {
      return this._makeRequest({
        $,
        path: "Spondyr",
        method: "POST",
        data,
      });
    },
    getSpondyr ({
      $, ...params
    }) {
      return this._makeRequest({
        $,
        path: "Spondyr",
        params,
      });
    },
    listTransactionTypes({ $ }) {
      return this._makeRequest({
        $,
        path: "TransactionTypes",
      });
    },
    listEventTypes({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "EventTypes",
        params,
      });
    },
  },
};
