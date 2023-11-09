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
      return "https://api.passcreator.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.access_token}`,
        },
      });
    },
    async getScan(scanId) {
      return this._makeRequest({
        path: `/space/api/23494978/${scanId}`,
      });
    },
    async getVoidedPass(voidPassId) {
      return this._makeRequest({
        path: `/space/api/23331211/${voidPassId}`,
      });
    },
    async getNewPass(newPassId) {
      return this._makeRequest({
        path: `/space/api/23331116/subscription+endpoint/${newPassId}`,
      });
    },
  },
};
