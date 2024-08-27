import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "docsautomator",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to use for generating the document",
      async options() {
        const templates = await this.listTemplates();
        return templates.map((template) => ({
          label: template.name,
          value: template.id,
        }));
      },
    },
    documentName: {
      type: "string",
      label: "Document Name",
      description: "The name of the generated document",
      optional: true,
    },
    recId: {
      type: "string",
      label: "Record ID",
      description: "Record ID for Airtable (Airtable only — data not required)",
      optional: true,
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "Task ID for ClickUp (ClickUp only — data not required)",
      optional: true,
    },
    data: {
      type: "object",
      label: "Data",
      description: "Placeholders data for the template",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.docsautomator.co";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
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
        ...opts,
        path: "/listTemplates",
      });
    },
    async duplicateGoogleDocTemplate({
      templateId, documentName, recId, taskId, data,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/duplicateGoogleDocTemplate",
        data: {
          templateId,
          documentName,
          recId,
          taskId,
          data,
        },
      });
    },
  },
};
