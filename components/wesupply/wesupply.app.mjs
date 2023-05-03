import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "wesupply",
  methods: {
    _apiUrl() {
      return `https://${this.$auth.client_name}.labs.wesupply.xyz/api`;
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
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
    importOrder({
      importType, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `${importType === "XML"
          ? ""
          : "json/"}import`,
        ...args,
      });
    },
  },
};
