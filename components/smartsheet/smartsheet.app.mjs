import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "smartsheet",
  propDefinitions: {
    sheetId: {
      type: "integer",
      label: "Sheet",
      description: "Select a sheet",
      async options({ page }) {
        const { data } = await this.listSheets({
          params: {
            page: page + 1,
          },
        });
        return data?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    rowId: {
      type: "integer",
      label: "Row",
      description: "Identifier of a row in a sheet",
      async options({ sheetId }) {
        const { rows } = await this.getSheet(sheetId);
        return rows?.map(({ id }) => ({
          label: `Row ID ${id}`,
          value: id,
        }));
      },
    },
    templateId: {
      type: "integer",
      label: "Template",
      description: "Select a template",
      async options() {
        const params = {
          includeAll: true,
        };
        const { data: userCreatedTemplates } = await this.listUserCreatedTemplates({
          params,
        });
        const { data: publicTemplates } = await this.listPublicTemplates({
          params,
        });
        const templates = [
          ...userCreatedTemplates,
          ...publicTemplates,
        ];
        return templates?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    workspaceId: {
      type: "integer",
      label: "Workspace",
      description: "Select a workspace",
      optional: true,
      async options({ page }) {
        const { data } = await this.listWorkspaces({
          params: {
            page: page + 1,
          },
        });
        return data?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    folderId: {
      type: "integer",
      label: "Folder",
      description: "Select a folder",
      optional: true,
      async options({ page }) {
        const { data } = await this.listFolders({
          params: {
            page: page + 1,
          },
        });
        return data?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.smartsheet.com/2.0";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _validateId(id) {
      return !isNaN(id);
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        path: "/webhooks",
        method: "POST",
        ...args,
      });
    },
    updateWebhook(webhookId, args = {}) {
      return this._makeRequest({
        path: `/webhooks/${webhookId}`,
        method: "PUT",
        ...args,
      });
    },
    deleteWebhook(webhookId, args = {}) {
      return this._makeRequest({
        path: `/webhooks/${webhookId}`,
        method: "DELETE",
        ...args,
      });
    },
    getRow(sheetId, rowId, args = {}) {
      if (!this._validateId(sheetId)) {
        return {};
      }
      return this._makeRequest({
        path: `/sheets/${sheetId}/rows/${rowId}`,
        ...args,
      });
    },
    getSheet(sheetId, args = {}) {
      if (!this._validateId(sheetId)) {
        return {};
      }
      return this._makeRequest({
        path: `/sheets/${sheetId}`,
        ...args,
      });
    },
    getComment(sheetId, commentId, args = {}) {
      if (!this._validateId(sheetId)) {
        return {};
      }
      return this._makeRequest({
        path: `/sheets/${sheetId}/comments/${commentId}`,
        ...args,
      });
    },
    listSheets(args = {}) {
      return this._makeRequest({
        path: "/sheets",
        ...args,
      });
    },
    listColumns(sheetId, args = {}) {
      if (!this._validateId(sheetId)) {
        return {};
      }
      return this._makeRequest({
        path: `/sheets/${sheetId}/columns`,
        ...args,
      });
    },
    listContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    listUserCreatedTemplates(args = {}) {
      return this._makeRequest({
        path: "/templates",
        ...args,
      });
    },
    listPublicTemplates(args = {}) {
      return this._makeRequest({
        path: "/templates/public",
        ...args,
      });
    },
    listFolders(args = {}) {
      return this._makeRequest({
        path: "/home/folders",
        ...args,
      });
    },
    listWorkspaces(args = {}) {
      return this._makeRequest({
        path: "/workspaces",
        ...args,
      });
    },
    createSheet(args = {}) {
      return this._makeRequest({
        path: "/sheets",
        method: "POST",
        ...args,
      });
    },
    createSheetInFolder(folderId, args = {}) {
      return this._makeRequest({
        path: `/folders/${folderId}/sheets`,
        method: "POST",
        ...args,
      });
    },
    createSheetInWorkspace(workspaceId, args = {}) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/sheets`,
        method: "POST",
        ...args,
      });
    },
    addRow(sheetId, args = {}) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/rows`,
        method: "POST",
        ...args,
      });
    },
    updateRow(sheetId, args = {}) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/rows`,
        method: "PUT",
        ...args,
      });
    },
  },
};
