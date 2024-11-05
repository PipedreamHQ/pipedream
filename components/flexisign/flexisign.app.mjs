import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "flexisign",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to generate the document from",
      async options() {
        const templates = await this.listTemplates();
        return templates.map((template) => ({
          label: template.name,
          value: template.id,
        }));
      },
    },
    recipients: {
      type: "string[]",
      label: "Recipients",
      description: "An array of recipient objects, with each recipient specified as a JSON string (e.g., '[{\"email\": \"example@example.com\"}]')",
    },
    message: {
      type: "string",
      label: "Message",
      description: "A personalized message for the recipients",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.flexisign.io/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/templates",
        ...opts,
      });
    },
    async sendSignatureRequest(opts = {}) {
      const {
        templateId, recipients, message,
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: "/signature/send",
        data: {
          template_id: templateId,
          recipients: recipients.map(JSON.parse),
          message,
        },
      });
    },
  },
};
