import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "wisepops",
  propDefinitions: {
    wisepopId: {
      type: "string",
      label: "Wisepop Id",
      description: "If you want the hook to transmit forms only from a specific pop-up.",
      optional: true,
      async options({ page }) {
        const wisepops = await this.listWisepops({
          page: page + 1,
        });

        return wisepops.map(({
          label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    accessToken() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://app.wisepops.com/api2";
    },
    _getHeaders() {
      return {
        Authorization: `WISEPOPS-API key="${this.accessToken()}"`,
      };
    },
    async _makeRequest({
      $ = this, path, ...options
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...options,
      };
      return axios($, config);
    },
    async createHook(data) {
      return await this._makeRequest({
        method: "POST",
        path: "hooks",
        data,
      });
    },
    async deleteHook(params) {
      return await this._makeRequest({
        method: "DELETE",
        path: "hooks",
        params,
      });
    },
    async listWisepops(params) {
      return await this._makeRequest({
        method: "GET",
        path: "wisepops",
        params,
      });
    },
  },
};
