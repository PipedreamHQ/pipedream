import { axios } from "@pipedream/platform";
import { DEFAULT_MAX_ITEMS } from "./common/constants.mjs";

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
      description: "Select a template from a workspace. Use the **List Workspace Templates** action to find template IDs. Example: `1122334455667788`.",
      async options() {
        const { data: workspaces } = await this.listAllWorkspaces();
        const templates = [];
        for (const ws of workspaces || []) {
          const { data: children } = await this.listAllWorkspaceChildren(ws.id, {
            params: {
              childrenResourceTypes: "sheets,templates",
            },
          });
          for (const child of children || []) {
            if (child.resourceType === "template") {
              templates.push({
                label: `${child.name} (${ws.name})`,
                value: child.id,
              });
            }
          }
        }
        return templates;
      },
    },
    workspaceId: {
      type: "integer",
      label: "Workspace",
      description: "Select a workspace. Use the **List Workspace Options** action to find workspace IDs. Example: `1234567890123456`.",
      optional: true,
      async options() {
        const { data } = await this.listAllWorkspaces();
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
      description: "Select a folder from a workspace. Use the **List Folder Options** action with a workspace ID to find folder IDs. Example: `9876543210987654`.",
      optional: true,
      async options({ workspaceId }) {
        if (!workspaceId) {
          return [];
        }
        const { data } = await this.listAllWorkspaceChildren(workspaceId, {
          params: {
            childrenResourceTypes: "folders",
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
      headers = {},
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...this._headers(),
          ...headers,
        },
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
    async listAllWorkspaces(args = {}) {
      const allData = [];
      let lastKey;
      do {
        const params = {
          paginationType: "token",
          maxItems: DEFAULT_MAX_ITEMS,
          ...args.params,
        };
        if (lastKey) {
          params.lastKey = lastKey;
        }
        const response = await this._makeRequest({
          path: "/workspaces",
          ...args,
          params,
        });
        if (response.data) {
          allData.push(...response.data);
        }
        lastKey = response.lastKey;
      } while (lastKey);
      return {
        data: allData,
      };
    },
    listWorkspaces(args = {}) {
      return this._makeRequest({
        path: "/workspaces",
        ...args,
        params: {
          paginationType: "token",
          maxItems: DEFAULT_MAX_ITEMS,
          ...args.params,
        },
      });
    },
    async listAllWorkspaceChildren(workspaceId, args = {}) {
      const allData = [];
      let lastKey;
      do {
        const params = {
          maxItems: DEFAULT_MAX_ITEMS,
          ...args.params,
        };
        if (lastKey) {
          params.lastKey = lastKey;
        }
        const response = await this._makeRequest({
          path: `/workspaces/${workspaceId}/children`,
          ...args,
          params,
        });
        if (response.data) {
          allData.push(...response.data);
        }
        lastKey = response.lastKey;
      } while (lastKey);
      return {
        data: allData,
      };
    },
    listFolderChildren(folderId, args = {}) {
      return this._makeRequest({
        path: `/folders/${folderId}/children`,
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
    getCurrentUser(args = {}) {
      return this._makeRequest({
        path: "/users/me",
        ...args,
      });
    },
    searchAll(args = {}) {
      return this._makeRequest({
        path: "/search",
        ...args,
      });
    },
    searchSheet(sheetId, args = {}) {
      return this._makeRequest({
        path: `/search/sheets/${sheetId}`,
        ...args,
      });
    },
    deleteRows(sheetId, args = {}) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/rows`,
        method: "DELETE",
        ...args,
      });
    },
    deleteSheet(sheetId, args = {}) {
      return this._makeRequest({
        path: `/sheets/${sheetId}`,
        method: "DELETE",
        ...args,
      });
    },
    updateSheetProperties(sheetId, args = {}) {
      return this._makeRequest({
        path: `/sheets/${sheetId}`,
        method: "PUT",
        ...args,
      });
    },
    copySheet(sheetId, args = {}) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/copy`,
        method: "POST",
        ...args,
      });
    },
    moveSheet(sheetId, args = {}) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/move`,
        method: "POST",
        ...args,
      });
    },
    importSheetInWorkspace(workspaceId, args = {}) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/sheets/import`,
        method: "POST",
        ...args,
      });
    },
    importSheetInFolder(folderId, args = {}) {
      return this._makeRequest({
        path: `/folders/${folderId}/sheets/import`,
        method: "POST",
        ...args,
      });
    },
    emailSheet(sheetId, args = {}) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/emails`,
        method: "POST",
        ...args,
      });
    },
    copyRows(sheetId, args = {}) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/rows/copy`,
        method: "POST",
        ...args,
      });
    },
    moveRows(sheetId, args = {}) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/rows/move`,
        method: "POST",
        ...args,
      });
    },
    addColumn(sheetId, args = {}) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/columns`,
        method: "POST",
        ...args,
      });
    },
    updateColumn(sheetId, columnId, args = {}) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/columns/${columnId}`,
        method: "PUT",
        ...args,
      });
    },
    deleteColumn(sheetId, columnId, args = {}) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/columns/${columnId}`,
        method: "DELETE",
        ...args,
      });
    },
    async getColumnMap(sheetId, args = {}) {
      const { data } = await this.listColumns(sheetId, {
        ...args,
        params: {
          includeAll: true,
          ...args.params,
        },
      });
      const byName = {};
      const byId = {};
      for (const col of data || []) {
        byName[col.title.toLowerCase()] = col.id;
        byId[col.id] = col.title;
      }
      return {
        byName,
        byId,
      };
    },
  },
};
