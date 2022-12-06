import { axios } from "@pipedream/platform";
import querystring from "query-string";

export default {
  type: "app",
  app: "jotform",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form",
      description: "The form to watch for new submissions",
      async options({ page = 0 }) {
        const limit = 20;
        const offset = page * limit;
        const forms = await this.getForms({
          offset,
          limit,
        });
        return forms.content.map((form) => ({
          label: form.title,
          value: form.id,
        }));
      },
    },
    formTitle: {
      type: "string",
      label: "Form Title",
      description: "Title of the new form",
    },
    questions: {
      type: "string[]",
      label: "Questions",
      description: `Array of JSON objects. Each object contains properties of a question.
        See documentation: https://api.jotform.com/docs/#post-forms
        Question types: https://www.jotform.com/developers/tools/#jotformQuestionTypes
        Example:
        \`{
          "type": "control_text",
          "text": "What is your last name?",
          "order": "2",
          "name": "lastname"
        }\``,
      optional: true,
      default: [],
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: `Array of JSON objects. Each object contains properties of a form email.
        See documentation: https://api.jotform.com/docs/#post-forms
        Example:
        \`{
          "type": "notification",
          "from": "from@example.com",
          "to": "to@example.com",
          "subject": "Email Subject",
          "html": "0",
          "body": "Email Body",
        }\``,
      optional: true,
      default: [],
    },
    formHeight: {
      type: "string",
      label: "Form Height",
      description: "Height of the form",
      optional: true,
    },
    max: {
      type: "integer",
      label: "Max Items",
      description: "Maximum number of items to return",
      default: 20,
    },
  },
  methods: {
    _getBaseUrl() {
      return `https://${this.$auth.region}.jotform.com/`;
    },
    _ensureTrailingSlash(str) {
      return (str.endsWith("/"))
        ? str
        : `${str}/`;
    },
    async _makeRequest({
      $, endpoint, method = "GET", params = null,
    }) {
      const config = {
        url: `${this._getBaseUrl()}${endpoint}`,
        headers: {
          "APIKEY": this.$auth.api_key,
        },
        method,
      };
      if (params) {
        const query = querystring.stringify(params);
        const sep = config.url.indexOf("?") === -1
          ? "?"
          : "&";
        config.url += `${sep}${query}`;
        config.url = config.url.replace("?&", "?");
      }
      return axios($ ?? this, config);
    },
    async createHook(opts = {}) {
      const {
        formId,
        endpoint,
      } = opts;
      return this._makeRequest({
        endpoint: `form/${encodeURIComponent(formId)}/webhooks`,
        method: "POST",
        params: {
          webhookURL: this._ensureTrailingSlash(endpoint),
        },
      });
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
        if (webhooks[idx] === this._ensureTrailingSlash(endpoint)) {
          webhookIdx = idx;
        }
      }
      if (webhookIdx === -1) {
        console.log(`Did not detect ${endpoint} as a webhook registered for form ID ${formId}.`);
        return;
      }
      console.log(`Deleting webhook at index ${webhookIdx}...`);
      return this._makeRequest({
        endpoint: `form/${encodeURIComponent(formId)}/webhooks/${encodeURIComponent(webhookIdx)}`,
        method: "DELETE",
      });
    },
    async getForm(formId) {
      return this._makeRequest({
        endpoint: `form/${formId}`,
      });
    },
    async getForms(params) {
      return this._makeRequest({
        endpoint: "user/forms",
        params,
      });
    },
    async getFormSubmissions({
      $, formId, params = null,
    }) {
      return this._makeRequest({
        $,
        endpoint: `form/${formId}/submissions`,
        params,
      });
    },
    async getUserSubmissions({ $ }) {
      return this._makeRequest({
        $,
        endpoint: "user/submissions",
      });
    },
    async getUserUsage({ $ }) {
      return this._makeRequest({
        $,
        endpoint: "user/usage",
      });
    },
    async getWebhooks(opts = {}) {
      const { formId } = opts;
      return this._makeRequest({
        endpoint: `form/${encodeURIComponent(formId)}/webhooks`,
      });
    },
  },
};
