import { axios } from "@pipedream/platform";

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
      console.log("delete hook data ", data);
      
      // if (!hookId) {
      //   throw new Error("Hook ID is required");
      // }
      return this._makeRequest({
        method: "DELETE",
        path: `/delete-webhook`,
        data,
        ...args,
      });
    },

    async listSheets(args = {}) {
      console.log("Listing sheets...", this.methods);
      const res = await this._makeRequest({
        method: "GET",
        path: "/list-sheets",
        ...args,
      });
      console.log("Sheets response:", res);
      return res;
    },

    async getRows({ sheetId, ...args } = {}) {
      const res = await this._makeRequest({
        method: "GET",
        path: `/sheets/${sheetId}`,
        ...args,
      });

      const data = res?.data ?? res;
      console.log("get sample row ", data);

      return data;
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.csvbox.io/1.1${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "x-csvbox-api-key": `${this.$auth.api_key}`,
        "x-csvbox-secret-api-key": `${this.$auth.secret_api_key}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        debug: true,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
        ...args,
      });
    },
    submitFile(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/file",
        ...args,
      });
    },
  },
};
