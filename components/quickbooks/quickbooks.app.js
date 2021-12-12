const { axios } = require("@pipedream/platform");
const {
  WEBHOOK_ENTITIES,
  WEBHOOK_OPERATIONS,
} = require("./constants");

module.exports = {
  type: "app",
  app: "quickbooks",
  propDefinitions: {
    webhookNames: {
      type: "string[]",
      label: "Entities",
      description: "Select which QuickBooks entities to emit or just leave it blank to emit them all.",
      options: WEBHOOK_ENTITIES,
      optional: true,
    },
    webhookOperations: {
      type: "string[]",
      label: "Operations",
      description: "Select which operations to emit or just leave it blank to emit them all.",
      options: WEBHOOK_OPERATIONS,
      default: WEBHOOK_OPERATIONS,
      optional: true,
    },
    webhookVerifierToken: {
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
    companyId() {
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
      try {
        const companyId = this.companyId();
        return await this._makeRequest($, {
          path: `company/${companyId}/${entity.toLowerCase()}/${id}/pdf`,
          headers: {
            "Accept": "application/pdf",
          },
          responseType: "stream",
        });
      } catch (ex) {
        if (ex.response.data.statusCode === 400) {
          throw new Error(`Request failed with status code 400. Double-check that '${id}' is a valid ${entity} record ID.`);
        } else {
          throw ex;
        }
      }
    },
    async getRecordDetails(entityName, id) {
      const companyId = this.companyId();
      return await this._makeRequest(this, {
        path: `company/${companyId}/${entityName.toLowerCase()}/${id}`,
      });
    },
  },
};
