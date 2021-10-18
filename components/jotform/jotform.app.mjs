import axios from "axios";
import querystring from "querystring";

export default {
  type: "app",
  app: "jotform",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form",
      description: "The form to watch for new submissions",
      async options({ page = 0 }) {
        const limit = 3;
        const offset = page * limit;
        const forms = await this.getForms({
          offset,
          limit,
        });
        return forms.content.map((form) => {
          return {
            label: form.title,
            value: form.id,
          };
        });
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
  },
  methods: {
    _getBaseUrl() {
      return `https://${this.$auth.region}.jotform.com/`;
    },
    _ensureTrailingSlash(str) {
      if (str.endsWith("/")) return str;
      return `${str}/`;
    },
    async _makeRequest(endpoint, method = "GET", params = null) {
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
      return await axios(config);
    },
    async createHook(opts = {}) {
      const {
        formId,
        endpoint,
      } = opts;
      return (await this._makeRequest(
        `form/${encodeURIComponent(formId)}/webhooks`,
        "POST",
        {
          webhookURL: this._ensureTrailingSlash(endpoint),
        },
      ));
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
      return (await this._makeRequest(
        `form/${encodeURIComponent(formId)}/webhooks/${encodeURIComponent(webhookIdx)}`,
        "DELETE",
      ));
    },
    async getForms(params) {
      return (await this._makeRequest(
        "user/forms",
        "GET",
        params,
      )).data;
    },
    async getFormSubmissions(params) {
      const { formId } = params;
      return (await this._makeRequest(
        `form/${formId}/submissions`,
        "GET",
        params,
      )).data;
    },
    async getUserSubmissions(params) {
      return (await this._makeRequest(
        "user/submissions",
        "GET",
        params,
      )).data;
    },
    async getUserUsage() {
      return (await this._makeRequest(
        "user/usage",
        "GET",
      )).data;
    },
    async getWebhooks(opts = {}) {
      const { formId } = opts;
      return (await this._makeRequest(
        `form/${encodeURIComponent(formId)}/webhooks`,
        "GET",
      )).data;
    },
  },
};
