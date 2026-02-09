import {
  axios, ConfigurationError,
} from "@pipedream/platform";
const DEFAULT_LIMIT = 50;

export default {
  type: "app",
  app: "microsoft_excel",
  propDefinitions: {
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "The ID of the folder where the item is located",
      async options() {
        const folders = await this.listFolderOptions();
        return [
          "root",
          ...folders,
        ];
      },
    },
    sheetId: {
      type: "string",
      label: "Sheet ID",
      description: "The ID of the spreadsheet you want to use",
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
    worksheet: {
      type: "string",
      label: "Worksheet",
      description: "The name of the worksheet to use",
      async options({
        sheetId, page,
      }) {
        const limit = DEFAULT_LIMIT;
        const { value } = await this.listWorksheets({
          sheetId,
          params: {
            $top: limit,
            $skip: limit * page,
          },
        });
        return value.map(({ name }) => name );
      },
    },
    tableRowId: {
      type: "string",
      label: "Row ID",
      description: "The ID of the row you want to use",
      async options({
        sheetId, tableId,
      }) {
        const { value } = await this.listTableRows({
          sheetId,
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
      label: "Table ID",
      description: "The ID of the table you want to use",
      async options({ sheetId }) {
        const { value } = await this.listTables({
          sheetId,
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
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      try {
        const config = {
          url: `${this._apiUrl()}/${path}`,
          headers: this._getHeaders(),
          ...opts,
        };

        return await axios($, config);
      } catch (error) {
        throw new ConfigurationError(error.message);
      }
    },
    addTableRow({
      sheetId, tableId, tableName, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `me/drive/items/${sheetId}/workbook/tables/${tableId || tableName}/rows/add`,
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
    listTableRows({
      sheetId, tableId, ...args
    }) {
      return this._makeRequest({
        path: `me/drive/items/${sheetId}/workbook/tables/${tableId}/rows`,
        ...args,
      });
    },
    // List tables endpoint is not supported for personal accounts
    listTables({
      sheetId, ...args
    }) {
      return this._makeRequest({
        path: `me/drive/items/${sheetId}/workbook/tables`,
        ...args,
      });
    },
    listWorksheets({
      sheetId, ...args
    }) {
      return this._makeRequest({
        path: `/me/drive/items/${sheetId}/workbook/worksheets`,
        ...args,
      });
    },
    updateTableRow({
      sheetId, tableId, rowId, ...args
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `me/drive/items/${sheetId}/workbook/tables/${tableId}/rows/ItemAt(index=${rowId})`,
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
    getDriveItem({
      itemId, ...args
    }) {
      return this._makeRequest({
        path: `me/drive/items/${itemId}`,
        ...args,
      });
    },
    getDelta({
      path, token, ...args
    }) {
      return this._makeRequest({
        path: `${path}/delta?token=${token}`,
        ...args,
      });
    },
    getRange({
      sheetId, worksheet, range, ...args
    }) {
      return this._makeRequest({
        path: `me/drive/items/${sheetId}/workbook/worksheets/${worksheet}/range(address='${range}')`,
        ...args,
      });
    },
    getUsedRange({
      sheetId, worksheet, ...args
    }) {
      return this._makeRequest({
        path: `me/drive/items/${sheetId}/workbook/worksheets/${worksheet}/range/usedRange`,
        ...args,
      });
    },
    insertRange({
      sheetId, worksheet, range, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `me/drive/items/${sheetId}/workbook/worksheets/${worksheet}/range(address='${range}')/insert`,
        ...args,
      });
    },
    updateRange({
      sheetId, worksheet, range, ...args
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `me/drive/items/${sheetId}/workbook/worksheets/${worksheet}/range(address='${range}')`,
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
