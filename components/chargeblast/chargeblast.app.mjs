import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "chargeblast",
  propDefinitions: {
    apiKey: {
      type: "string",
      label: "API Key",
      description: "Your Chargeblast API Key",
      secret: true,
    },
    alertType: {
      type: "string",
      label: "Alert Type",
      description: "The type of alert to filter by",
      optional: true,
      async options() {
        return [
          {
            label: "All",
            value: "",
          },
          {
            label: "Fraud",
            value: "fraud",
          },
          {
            label: "Chargeback",
            value: "chargeback",
          },
          {
            label: "Other",
            value: "other",
          },
        ];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.chargeblast.io";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, params, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        params,
      });
    },
    async getAlerts({ alertType }) {
      return this._makeRequest({
        path: "/embed/alerts",
        params: {
          alert_type: alertType,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
  version: "0.0.{{ts}}",
};
