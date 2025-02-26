import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "opnform",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "The ID of the workspace containing the forms.",
      async options() {
        const worspaces = await this.listWorkspaces();
        return worspaces.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    formId: {
      type: "string",
      label: "Form",
      description: "Select the form to monitor for new submissions.",
      async options({ workspaceId }) {
        const forms = await this.listForms({
          params: {
            workspace_id: workspaceId,
          },
        });
        return forms.map((form) => ({
          label: form.name,
          value: form.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.opnform.com/external/zapier";
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
    listForms(opts = {}) {
      return this._makeRequest({
        path: "/forms",
        ...opts,
      });
    },
    listWorkspaces(opts = {}) {
      return this._makeRequest({
        path: "/workspaces",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook",
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/webhook",
        ...opts,
      });
    },
  },
};
