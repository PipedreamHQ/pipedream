const axios = require("axios");

module.exports = {
  type: "app",
  app: "formstack",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Forms",
      optional: true,
      async options() {
        const options = [];
        const results = await this.getForms();
        for (const form of results) {
          options.push({ label: form.name, value: form.id });
        }
        return options;
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
      return "https://www.formstack.com/api/v2"
    },
    _getAuthHeaders() {
      return {
        'Authorization': `Bearer ${this.$auth.oauth_access_token}`,
        'Content-Type': 'application/json',
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
        }
      }
      return (await axios(config)).data;
    },
    async deleteHook({ hookId }) {
      const config = {
        method: "DELETE",
        url: `${this._getBaseURL()}/webhook/${hookId}.json`,
        headers: this._getAuthHeaders(),
      }
      return await axios(config);
    },
    async getForms() {
      let total = 1;
      let count = 0;
      const forms = [];
      const config = {
        method: "GET",
        url: `${this._getBaseURL()}/form.json`,
        headers: this._getAuthHeaders(),
        params: {
          page: 1,
          per_page: 100,
          folders: false,
        }
      }
      while (count < total) {
        const results = (await axios(config)).data;
        total = results.total;
        for (const form of results.forms) {
          forms.push(form);
          count++;
        }
        config.params.page++;
      }
      return forms;
    }
  }
};