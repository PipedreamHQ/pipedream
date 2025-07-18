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
      async options({
        page = 0, teamId, excludeDeleted = false,
      }) {
        const limit = 20;
        const offset = page * limit;
        let { content: forms } = await this.getForms({
          offset,
          limit,
        }, teamId);
        if (excludeDeleted) {
          forms = forms.filter(({ status }) => status !== "DELETED");
        }
        return forms.map((form) => ({
          label: form.title,
          value: form.id,
        }));
      },
    },
    teamId: {
      type: "string",
      label: "Team",
      description: "The identifier of a team. Note: Teams is a Jotform Enterprise feature.",
      optional: true,
      async options({ page = 0 }) {
        const limit = 20;
        const offset = page * limit;
        const { content } = await this.listTeams({
          offset,
          limit,
        });
        return content.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
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
      return this.$auth.subdomain
        ? `https://${this.$auth.subdomain}.jotform.com/API/`
        : `https://${this.$auth.region}.jotform.com/`;
    },
    _ensureTrailingSlash(str) {
      return (str.endsWith("/"))
        ? str
        : `${str}/`;
    },
    _headers(teamId) {
      const headers = {
        "APIKEY": this.$auth.api_key,
      };
      if (teamId) {
        headers["jf-team-id"] = teamId;
      }
      return headers;
    },
    async _makeRequest({
      $, endpoint, method = "GET", params = null, teamId,
    }) {
      const config = {
        url: `${this._getBaseUrl()}${endpoint}`,
        headers: this._headers(teamId),
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
        teamId,
      } = opts;
      return this._makeRequest({
        endpoint: `form/${encodeURIComponent(formId)}/webhooks`,
        method: "POST",
        params: {
          webhookURL: this._ensureTrailingSlash(endpoint),
        },
        teamId,
      });
    },
    async deleteHook(opts = {}) {
      const {
        formId,
        endpoint,
        teamId,
      } = opts;
      const result = await this.getWebhooks({
        formId,
        teamId,
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
        teamId,
      });
    },
    async getForm(formId, teamId) {
      return this._makeRequest({
        endpoint: `form/${formId}`,
        teamId,
      });
    },
    async getForms(params, teamId) {
      return this._makeRequest({
        endpoint: "user/forms",
        params,
        teamId,
      });
    },
    getFormSubmission({
      $, submissionId, teamId,
    }) {
      return this._makeRequest({
        $,
        endpoint: `submission/${submissionId}`,
        teamId,
      });
    },
    async getFormSubmissions({
      $, formId, teamId, params = null,
    }) {
      return this._makeRequest({
        $,
        endpoint: `form/${formId}/submissions`,
        params,
        teamId,
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
      const {
        formId, teamId,
      } = opts;
      return this._makeRequest({
        endpoint: `form/${encodeURIComponent(formId)}/webhooks`,
        teamId,
      });
    },
    listTeams(opts = {}) {
      return this._makeRequest({
        endpoint: "/team/user/me",
        ...opts,
      });
    },
  },
};
