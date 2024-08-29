import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "docsautomator",
  propDefinitions: {
    automationId: {
      type: "string",
      label: "Automation ID",
      description: "The ID of the automation to use for generating the document",
      async options() {
        const { automations } = await this.listAutomations();

        return automations.map(({
          title: label, _id: value,
        }) => ({
          label,
          value,
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
      description: "Placeholders data for the template. [See the documentation](https://docs.docsautomator.co/integrations-api/docsautomator-api) for further information.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.docsautomator.co";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listAutomations(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/automations",
      });
    },
    createDocument(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/createDocument",
        ...opts,
      });
    },
  },
};
