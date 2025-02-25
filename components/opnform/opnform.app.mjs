import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "opnform",
  version: "0.0.{{ts}}",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "The ID of the workspace containing the forms.",
    },
    formId: {
      type: "string",
      label: "Form",
      description: "Select the form to monitor for new submissions.",
      async options() {
        const { workspaceId } = this;
        const forms = await this.listForms({
          workspaceId,
        });
        return forms.map((form) => ({
          label: form.name,
          value: form.id,
        }));
      },
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.opnform.com/external/zapier";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, params, data, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        params,
        data,
        ...otherOpts,
      });
    },
    async listForms({
      workspaceId, ...opts
    } = {}) {
      if (!workspaceId) {
        throw new Error("workspaceId is required to list forms.");
      }
      return this._makeRequest({
        method: "GET",
        path: "/forms",
        params: {
          workspace_id: workspaceId,
        },
        ...opts,
      });
    },
    async createWebhook({
      hookUrl, formId, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook",
        data: {
          hookUrl,
          form_id: formId,
        },
        ...opts,
      });
    },
    async paginate(fn, ...opts) {
      let results = [];
      let response;
      let hasMore = true;
      let page = 1;

      while (hasMore) {
        response = await fn({
          page,
          ...opts,
        });
        if (Array.isArray(response) && response.length > 0) {
          results = results.concat(response);
          page += 1;
        } else {
          hasMore = false;
        }
      }

      return results;
    },
  },
};
