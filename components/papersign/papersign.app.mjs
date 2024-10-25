import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "papersign",
  propDefinitions: {
    documentId: {
      type: "string",
      label: "Document ID",
      description: "Enter the ID of the Papersign document",
      async options({ page }) {
        return await this.list({
          module: "documents",
          page,
        });
      },
    },
    spaceId: {
      type: "string",
      label: "Space ID",
      description: "Enter the ID of the Papersign space",
      async options({ page }) {
        return await this.list({
          module: "spaces",
          page,
        });
      },
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "Enter the ID of the Papersign folder. `If folder id is present, Space Id and Path will be ignored`.",
      async options({ page }) {
        return await this.list({
          module: "folders",
          page,
        });
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.paperform.co/v1/papersign";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.access_token}`,
        "accept": "application/json",
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
    async list({
      module, page, ...opts
    }) {
      const { results } = await this._makeRequest({
        path: `/${module}`,
        params: {
          limit: LIMIT,
          skip: LIMIT * page,
        },
        ...opts,
      });

      return results[module].map(({
        id: value, name: label,
      }) => ({
        value,
        label,
      }));
    },
    duplicateDocument({
      documentId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/documents/${documentId}/copy`,
        ...opts,
      });
    },
    getDocument({
      documentId, ...opts
    }) {
      return this._makeRequest({
        path: `/documents/${documentId}`,
        ...opts,
      });
    },
    sendDocument({
      documentId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/documents/${documentId}/send`,
        ...opts,
      });
    },
    createWebhook({
      folderId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/folders/${folderId}/webhooks`,
        ...opts,
      });
    },
    deleteWebhook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
      });
    },
  },
};
