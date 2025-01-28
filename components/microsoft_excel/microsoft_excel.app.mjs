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
        const folders = await this.listFolderOptions();
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
      itemId, tableId, tableName, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `me/drive/items/${itemId}/workbook/tables/${tableId || tableName}/rows/add`,
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
    // List tables endpoint is not supported for personal accounts
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
    batch(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "$batch",
        ...args,
      });
    },
    async listFolderOptions({
      folderId = null, prefix = "", batchLimit = 20, ...args
    } = {}) {
      const options = [];
      const stack = [
        {
          folderId,
          prefix,
        },
      ];
      const history = [];

      try {
        while (stack.length) {
          const currentBatch = [];
          while (stack.length && currentBatch.length < batchLimit) {
            const {
              folderId,
              prefix,
            } = stack.shift();
            history.push({
              folderId,
              prefix,
            });
            currentBatch.push({
              id: folderId || "root",
              method: "GET",
              url: folderId
                ? `/me/drive/items/${folderId}/children?$filter=folder ne null`
                : "/me/drive/root/children?$filter=folder ne null",
            });
          }

          const { responses: batchResponses } =
            await this.batch({
              ...args,
              data: {
                ...args?.data,
                requests: currentBatch,
              },
            });

          batchResponses.forEach(({
            id, status, body,
          }) => {
            if (status === 200) {
              body.value.forEach((item) => {
                const {
                  id, name, folder: { childCount }, parentReference: { id: parentId },
                } = item;
                const prefix = history.find(({ folderId }) => folderId === parentId)?.prefix || "";
                const currentLabel = `${prefix}${name}`;
                options.push({
                  value: id,
                  label: currentLabel,
                });

                if (childCount) {
                  stack.push({
                    folderId: id,
                    prefix: `${currentLabel}/`,
                  });
                }
              });
            } else {
              console.error(`Error in batch request ${id}:`, JSON.stringify(body));
            }
          });
        }
      } catch (error) {
        console.error("Error listing folders:", error);
      }

      return options;
    },
  },
};
