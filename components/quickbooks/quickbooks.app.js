const { axios } = require("@pipedream/platform");
const {
  WEBHOOK_ENTITIES,
  WEBHOOK_OPERATIONS,
} = require("./constants");

module.exports = {
  type: "app",
  app: "quickbooks",
  propDefinitions: {
    webhook_names: {
      type: "string[]",
      label: "Entities",
      description: "Select which QuickBooks entities to emit or just leave it blank to emit them all.",
      options: WEBHOOK_ENTITIES,
      optional: true,
    },
    webhook_operations: {
      type: "string[]",
      label: "Operations",
      description: "Select which operations to emit or just leave it blank to emit them all.",
      options: WEBHOOK_OPERATIONS,
      default: WEBHOOK_OPERATIONS,
      optional: true,
    },
    webhook_verifier_token: {
      type: "string",
      label: "Verifier Token",
      description: "[Create an app](https://developer.intuit.com/app/developer/qbo/docs/build-your-first-app) " +
      "on the Intuit Developer Dashboard and [set up a webhook](https://developer.intuit.com/app/developer/qbo/docs/develop/webhooks). " +
      "Once you have a [verifier token](https://developer.intuit.com/app/developer/qbo/docs/develop/webhooks/managing-webhooks-notifications), " +
      "fill it in below. Note that if you want to send webhooks to more than one Pipedream source, you will have to create a new Dashboard app for each different source.",
      secret: true,
    },
  },
  methods: {
    _apiUrl() {
      return "https://quickbooks.api.intuit.com/v3";
    },

    _authToken() {
      return this.$auth.oauth_access_token;
    },

    _companyId() {
      return this.$auth.company_id;
    },

    _makeRequestConfig(config = {}) {
      const {
        headers,
        path = "",
        ...extraConfig
      } = config;
      const authToken = this._authToken();
      const baseUrl = this._apiUrl();
      const url = `${baseUrl}${path[0] === "/"
        ? ""
        : "/"}${path}`;
      return {
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...headers,
        },
        url,
        ...extraConfig,
      };
    },

    async _makeRequest($ = this, config) {
      const requestConfig = this._makeRequestConfig(config);
      return await axios($, requestConfig);
    },

    async getPDF($, entity, id) {
      const companyId = this._companyId();
      return await this._makeRequest($, {
        path: `company/${companyId}/${entity.toLowerCase()}/${id}/pdf`,
        headers: {
          "Accept": "application/pdf",
        },
        responseType: "stream",
      });
    },

    async getRecordDetails(endpoint, id) {
      const companyId = this._companyId();
      return await this._makeRequest(this, {
        path: `company/${companyId}/${endpoint.toLowerCase()}/${id}`,
      });

      // const config = {
      //   url: `https://quickbooks.api.intuit.com/v3/company/${this.$auth.company_id}/${endpoint.toLowerCase()}/${id}`,
      //   headers: {
      //     "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      //     "accept": "application/json",
      //     "content-type": "application/json",
      //   },
      // };
      // const { data } = await axios(config);
      // return data;
    },
  },
};
