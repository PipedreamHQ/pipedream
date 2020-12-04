const axios = require("axios");

module.exports = {
  type: "app",
  app: "formstack",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Forms",
      optional: true,
      async options({ page, prevContext }) {
        const options = [];
        const per_page = 100;
        let results = [];
        page = prevContext.page || 1;
        let total = prevContext.total >= 0 ? prevContext.total : per_page;
        if (total === per_page) {
          results = await this.getForms(page, per_page);
          for (const form of results) {
            options.push({ label: form.name, value: form.id });
          }
        }
        total = results.length;
        page++;
        return {
          options,
          context: { page, total },
        };
      },
    },
  },
  methods: {
    monthAgo() {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return monthAgo;
    },
    _getBaseURL() {
      return "https://www.formstack.com/api/v2";
    },
    _getAuthHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
      };
    },
    async createHook({ id, url }) {
      const config = {
        method: "POST",
        url: `${this._getBaseURL()}/form/${id}/webhook.json`,
        headers: this._getAuthHeaders(),
        params: {
          url,
          content_type: "json",
          handshake_key: this.$auth.oauth_refresh_token,
        },
      };
      return (await axios(config)).data;
    },
    async deleteHook({ hookId }) {
      const config = {
        method: "DELETE",
        url: `${this._getBaseURL()}/webhook/${hookId}.json`,
        headers: this._getAuthHeaders(),
      };
      return await axios(config);
    },
    async getForms(page, per_page) {
      const config = {
        method: "GET",
        url: `${this._getBaseURL()}/form.json`,
        headers: this._getAuthHeaders(),
        params: {
          page,
          per_page,
          folders: false,
        },
      };
      return (await axios(config)).data.forms;
    },
  },
};