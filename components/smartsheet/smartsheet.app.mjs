import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import {
  DEFAULT_MAX_ITEMS, SHEET_URL_PATTERN,
} from "./common/constants.mjs";
import { mapWithConcurrency } from "./common/utils.mjs";

export default {
  type: "app",
  app: "smartsheet",
  propDefinitions: {
    sheetId: {
      type: "string",
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
          value: String(id),
        })) || [];
      },
    },
    sheetIdOrUrl: {
      type: "string",
      label: "Sheet ID or URL",
      description: "The sheet to act on. Accepts a numeric sheet ID (e.g. `1234567890123456`), or a Smartsheet sheet URL, which is resolved to the ID for you. Use **List Sheets** to enumerate sheets, or **Search** to find one by name.",
    },
    workspaceIdInput: {
      type: "string",
      label: "Workspace ID",
      description: "Numeric workspace ID (e.g. `1234567890123456`). Use **List Workspace Options** to find one.",
      optional: true,
    },
    folderIdInput: {
      type: "string",
      label: "Folder ID",
      description: "Numeric folder ID (e.g. `9876543210987654`). Use **List Folder Options** with a workspace ID to find one.",
      optional: true,
    },
    templateId: {
      type: "string",
      label: "Template",
      description: "Select a template from a workspace. Use the **List Workspace Templates** action to find template IDs. Example: `1122334455667788`.",
      async options() {
        const { data: workspaces } = await this.listAllWorkspaces();
        // No list-all-templates endpoint, so every workspace is walked; failures are skipped.
        const perWorkspace = await mapWithConcurrency(workspaces || [], async (ws) => {
          try {
            const { data } = await this.listAllWorkspaceChildren(ws.id, {
              params: {
                childrenResourceTypes: "sheets,templates",
              },
            });
            return {
              ws,
              children: data,
            };
          } catch {
            return {
              ws,
              children: [],
            };
          }
        });
        const templates = [];
        for (const {
          ws, children,
        } of perWorkspace) {
          for (const child of children || []) {
            if (child.resourceType === "template") {
              templates.push({
                label: `${child.name} (${ws.name})`,
                value: String(child.id),
              });
            }
          }
        }
        return templates;
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
    // Throws rather than returning `{}`, which an agent reads as an empty sheet.
    _requireNumericId(value, label = "Sheet ID") {
      const trimmed = String(value ?? "").trim();
      if (/^\d+$/.test(trimmed)) {
        return trimmed;
      }
      // Remedy depends on the input: Search cannot resolve a permalink, and a bad Row or
      // Comment ID needs a different lookup than a Sheet ID.
      const isSheet = label === "Sheet ID";
      const remedy = SHEET_URL_PATTERN.test(trimmed)
        ? "That looks like a Smartsheet URL. The URL carries an opaque permalink token rather"
          + " than the ID, and **Search** cannot resolve it. Pass the URL to **Get Sheet**,"
          + " which resolves it, and use the `id` it returns."
        : isSheet
          ? "Use **Search** to find a sheet by name, or **List Sheets** to enumerate them."
          : `Run **Get Sheet** and read the ${label.replace(/ ID$/, "").toLowerCase()} IDs from its response.`;
      throw new ConfigurationError(`\`${label}\` must be a numeric Smartsheet ID, but received \`${value}\`. ${remedy}`);
    },
    // A sheet URL carries an opaque token, so it resolves only by matching permalinks.
    async resolveSheetId(value, args = {}) {
      const trimmed = String(value ?? "").trim();
      if (/^\d+$/.test(trimmed)) {
        return trimmed;
      }
      if (!SHEET_URL_PATTERN.test(trimmed)) {
        return this._requireNumericId(trimmed);
      }
      const { data } = await this.listSheets({
        ...args,
        params: {
          includeAll: true,
          ...args.params,
        },
      });
      const normalize = (url) => String(url || "").split("?")[0]
        .replace(/\/+$/, "")
        .toLowerCase();
      const target = normalize(trimmed);
      const match = data?.find((sheet) => normalize(sheet.permalink) === target);
      if (!match) {
        throw new ConfigurationError(
          `No sheet matching the URL \`${value}\` was found among the ${data?.length || 0} sheet(s)`
          + " this account can access. The sheet may not be shared with this account, or the URL"
          + " may point at a report or dashboard rather than a sheet.",
        );
      }
      return String(match.id);
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
      const sheet = this._requireNumericId(sheetId);
      const row = this._requireNumericId(rowId, "Row ID");
      return this._makeRequest({
        path: `/sheets/${sheet}/rows/${row}`,
        ...args,
      });
    },
    getSheet(sheetId, args = {}) {
      const sheet = this._requireNumericId(sheetId);
      return this._makeRequest({
        path: `/sheets/${sheet}`,
        ...args,
      });
    },
    getComment(sheetId, commentId, args = {}) {
      const sheet = this._requireNumericId(sheetId);
      const comment = this._requireNumericId(commentId, "Comment ID");
      return this._makeRequest({
        path: `/sheets/${sheet}/comments/${comment}`,
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
      const sheet = this._requireNumericId(sheetId);
      return this._makeRequest({
        path: `/sheets/${sheet}/columns`,
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
