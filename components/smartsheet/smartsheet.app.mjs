import { axios } from "@pipedream/platform";
import { DEFAULT_MAX_ITEMS } from "./common/constants.mjs";

export default {
  type: "app",
  app: "smartsheet",
  propDefinitions: {
    sheetId: {
      type: "string",
      label: "Sheet ID",
      description: "The ID of the sheet. Use **List Sheets** to find sheet IDs.",
    },
    rowId: {
      type: "string",
      label: "Row ID",
      description: "The ID of the row. Use **Get Sheet** or **Search** to find row IDs.",
    },
    rowIds: {
      type: "string",
      label: "Row IDs",
      description: "Comma-separated list of row IDs, or a JSON array. Use **Get Sheet** to find row IDs.",
    },
    discussionId: {
      type: "string",
      label: "Discussion ID",
      description: "The ID of the discussion. Use **List Discussions** to find a Discussion ID.",
    },
    commentId: {
      type: "string",
      label: "Comment ID",
      description: "The ID of the comment. Use **Get Discussion** to find a Comment ID.",
    },
    columnId: {
      type: "string",
      label: "Column ID",
      description: "The ID of the column. Use **List Columns** to find column IDs.",
    },
    destinationSheetId: {
      type: "string",
      label: "Destination Sheet ID",
      description: "The ID of the destination sheet. Use **List Sheets** to find sheet IDs.",
    },
    destinationId: {
      type: "string",
      label: "Destination ID",
      description: "The ID of the destination workspace or folder. Use **List Workspace Options** or **List Folder Options** to find the relevant ID.",
    },
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "The ID of the workspace. Use **List Workspace Options** to find workspace IDs. Example: `1234567890123456`.",
      optional: true,
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
    createDiscussion(sheetId, args = {}) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/discussions`,
        method: "POST",
        ...args,
      });
    },
    createRowDiscussion(sheetId, rowId, args = {}) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/rows/${rowId}/discussions`,
        method: "POST",
        ...args,
      });
    },
    getDiscussion(sheetId, discussionId, args = {}) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/discussions/${discussionId}`,
        ...args,
      });
    },
    listDiscussions(sheetId, args = {}) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/discussions`,
        ...args,
      });
    },
    listRowDiscussions(sheetId, rowId, args = {}) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/rows/${rowId}/discussions`,
        ...args,
      });
    },
    deleteDiscussion(sheetId, discussionId, args = {}) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/discussions/${discussionId}`,
        method: "DELETE",
        ...args,
      });
    },
    addComment(sheetId, discussionId, args = {}) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/discussions/${discussionId}/comments`,
        method: "POST",
        ...args,
      });
    },
    updateComment(sheetId, commentId, args = {}) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/comments/${commentId}`,
        method: "PUT",
        ...args,
      });
    },
    deleteComment(sheetId, commentId, args = {}) {
      return this._makeRequest({
        path: `/sheets/${sheetId}/comments/${commentId}`,
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
        const key = col.title.toLowerCase();
        if (byName[key] !== undefined && byName[key] !== col.id) {
          throw new Error(`Ambiguous column name "${col.title}" in sheet ${sheetId}: matches multiple column IDs (${byName[key]}, ${col.id}). Reference these columns by ID instead.`);
        }
        byName[key] = col.id;
        byId[col.id] = col.title;
      }
      return {
        byName,
        byId,
      };
    },
  },
};
