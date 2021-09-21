const axios = require("axios");
const querystring = require("querystring");

function ensureTrailingSlash(str) {
  if (str.endsWith("/")) return str;
  return `${str}/`;
}

module.exports = {
  type: "app",
  app: "jotform",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form",
      description: "The form to watch for new submissions",
      async options() {
        const forms = await this.getForms(this.$auth.api_key);
        return forms.content.map((form) => {
          return {
            label: form.title,
            value: form.id,
          };
        });
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return `https://${this.$auth.region}.jotform.com/`;
    },
    async _makeRequest(config) {
      config.headers = {
        "APIKEY": this.$auth.api_key,
      };
      if (config.params) {
        const query = querystring.stringify(config.params);
        delete config.params;
        const sep = config.url.indexOf("?") === -1
          ? "?"
          : "&";
        config.url += `${sep}${query}`;
        config.url = config.url.replace("?&", "?");
      }
      return await axios(config);
    },
    async getForms() {
      return (await this._makeRequest({
        url: `${this._getBaseUrl()}user/forms`,
        method: "GET",
      })).data;
    },
    async getWebhooks(opts = {}) {
      const { formId } = opts;
      return (await this._makeRequest({
        url: `${this._getBaseUrl()}form/${encodeURIComponent(formId)}/webhooks`,
        method: "GET",
      })).data;
    },
    async createHook(opts = {}) {
      const {
        formId,
        endpoint,
      } = opts;
      return (await this._makeRequest({
        url: `${this._getBaseUrl()}form/${encodeURIComponent(formId)}/webhooks`,
        method: "POST",
        params: {
          webhookURL: ensureTrailingSlash(endpoint),
        },
      }));
    },
    async deleteHook(opts = {}) {
      const {
        formId,
        endpoint,
      } = opts;
      const result = await this.getWebhooks({
        formId,
      });
      let webhooks = Object.values(result && result.content || {});
      let webhookIdx = -1;
      for (let idx in webhooks) {
        if (webhooks[idx] === ensureTrailingSlash(endpoint)) {
          webhookIdx = idx;
        }
      }
      if (webhookIdx === -1) {
        console.log(`Did not detect ${endpoint} as a webhook registered for form ID ${formId}.`);
        return;
      }
      console.log(`Deleting webhook at index ${webhookIdx}...`);
      return (await this._makeRequest({
        url: `${this._getBaseUrl()}form/${encodeURIComponent(formId)}/webhooks/${encodeURIComponent(webhookIdx)}`,
        method: "DELETE",
      }));
    },
  },
};
