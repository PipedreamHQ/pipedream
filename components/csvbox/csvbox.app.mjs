import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "csvbox",
  propDefinitions: {
    sheetId: {
      type: "string",
      label: "Sheet",
      description: "Select the sheet you want to receive data from",
      optional: true,
      async options() {
        const { data } = await this.listSheets();
        return data.map((sheet) => ({
          label: sheet.name,
          value: sheet.value,
        }));
      },
    },
  },

  methods: {
    _getAuthKeys() {
      return this.$auth.api_key;
    },
    _getSecretAuthKeys() {
      return this.$auth.secret_api_key;
    },
    _getUrl(path) {
      return `${constants.BASE_URL}${path}`;
    },
    _getHeaders(headers) {
      return {
        ...headers,
        accept: "application/json",
        "Content-Type": "application/json",
        "x-csvbox-api-key": this._getAuthKeys(),
        "x-csvbox-secret-api-key": this._getSecretAuthKeys(),
      };
    },

    async _makeRequest({ $ = this, path, headers, ...otherConfig } = {}) {
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        auth: this._getAuthKeys(),
        returnFullResponse: true,
        ...otherConfig,
      };
      return axios($, config);
    },

    async createHook({ data, ...args } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/register-webhook",
        data,
        ...args,
      });
    },

    async deleteHook({ data, ...args } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/delete-webhook`,
        data,
        ...args,
      });
    },

    async listSheets(args = {}) {
      const res = await this._makeRequest({
        method: "GET",
        path: "/list-sheets",
        ...args,
      });
      return res;
    },
  },
};