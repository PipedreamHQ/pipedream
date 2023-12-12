import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "microsoft_excel",
  propDefinitions: {
    folderId: {
      type: "string",
      label: "Folder Id",
      description: "The ID of the folder where the item is located.",
      async options() {
        const folders = await this.listFolders();
        return [
          "root",
          ...folders,
        ];
      },
    },
    itemId: {
      type: "string",
      label: "Item Id",
      description: "The Id of the item you want to use.",
      async options({ folderId }) {
        const { value } = await this.listItems({
          folderId,
        });

        return value.filter(
          (item) => item.file?.mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ).map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    rowId: {
      type: "string",
      label: "Row Id",
      description: "The Id of the row you want to use.",
      async options({
        itemId, tableId,
      }) {
        const { value } = await this.listRows({
          itemId,
          tableId,
        });

        return value.map(({
          index: value, values,
        }) => ({
          label: JSON.stringify(values),
          value,
        }));
      },
    },
    tableId: {
      type: "string",
      label: "Table Id",
      description: "The Id of the table you want to use.",
      async options({ itemId }) {
        const { value } = await this.listTables({
          itemId,
        });

        return value.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    values: {
      type: "string",
      label: "Values",
      description: "A 2-dimensional array of unformatted values of the table row. [See the documentation to get the data format](https://learn.microsoft.com/en-us/graph/api/tablerowcollection-add?view=graph-rest-1.0&tabs=http).",
    },
  },
  methods: {
    _apiUrl() {
      return "https://graph.microsoft.com/v1.0";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    addRow({
      itemId, tableId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `me/drive/items/${itemId}/workbook/tables/${tableId}/rows`,
        ...args,
      });
    },
    createHook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "subscriptions",
        ...args,
      });
    },
    deleteHook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `subscriptions/${hookId}`,
      });
    },
    async listFolders({
      folderId = null,
      prefix = "", ...args
    } = {}) {
      const foldersArray = [];
      const { value: items } = await this._makeRequest({
        path: folderId
          ? `/me/drive/items/${folderId}/children`
          : "me/drive/root/children",
        ...args,
      });

      const folders = items.filter((item) => item.folder);
      for (const {
        id, name, folder: { childCount = null },
      } of folders) {
        foldersArray.push({
          value: id,
          label: `${prefix}${name}`,
        });

        if (childCount) {
          const children = await this.listFolders({
            folderId: id,
            prefix: prefix + "-",
          });
          foldersArray.push(...children);
        }
      }

      return foldersArray;
    },
    listItems({
      folderId, ...args
    }) {
      return this._makeRequest({
        path: (folderId === "root")
          ? "me/drive/root/children"
          : `/me/drive/items/${folderId}/children`,
        ...args,
      });
    },
    listRows({
      itemId, tableId, ...args
    }) {
      return this._makeRequest({
        path: `me/drive/items/${itemId}/workbook/tables/${tableId}/rows`,
        ...args,
      });
    },
    listTables({
      itemId, ...args
    }) {
      return this._makeRequest({
        path: `me/drive/items/${itemId}/workbook/tables`,
        ...args,
      });
    },
    updateRow({
      itemId, tableId, rowId, ...args
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `me/drive/items/${itemId}/workbook/tables/${tableId}/rows/itemAt(index=${rowId})`,
        ...args,
      });
    },
    updateSubscription({
      hookId, ...args
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `subscriptions/${hookId}`,
        ...args,
      });
    },
  },
};
