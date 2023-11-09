import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "passcreator",
  propDefinitions: {
    scanId: {
      type: "string",
      label: "Scan ID",
      description: "The ID of the app scan",
    },
    voidPassId: {
      type: "string",
      label: "Voided Pass ID",
      description: "The ID of the voided pass",
    },
    newPassId: {
      type: "string",
      label: "New Pass ID",
      description: "The ID of the new wallet pass",
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.passcreator.com/api";
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          "Authorization": `${this._apiKey()}`,
        },
      });
    },
    createSubscription(args = {}) {
      return this._makeRequest({
        path: "/hook/subscribe",
        method: "POST",
        ...args,
      });
    },
    deleteSubscription(args = {}) {
      return this._makeRequest({
        path: "/hook/unsubscribe",
        method: "DELETE",
        ...args,
      });
    },
  },
};
