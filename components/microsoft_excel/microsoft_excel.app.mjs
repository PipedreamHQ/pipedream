import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";
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
      description: "A 2-dimensional array of unformatted values of the table row. E.g. `[[1, 2, 3], [4, 5, 6]]` according to the table schema. [See the documentation to get the data format](https://learn.microsoft.com/en-us/graph/api/tablerowcollection-add?view=graph-rest-1.0&tabs=http).",
    },
  },
  methods: {
    client() {
      return Client.init({
        authProvider: (done) => {
          done(null, this.$auth.oauth_access_token);
        },
      });
    },
    addTableRow({
      sheetId, tableId, tableName, data = {},
    } = {}) {
      return this.client().api(`/me/drive/items/${sheetId}/workbook/tables/${tableId || tableName}/rows/add`)
        .post(data);
    },
    createHook({ data = {} } = {}) {
      return this.client().api("/subscriptions")
        .post(data);
    },
    deleteHook(hookId) {
      return this.client().api(`/subscriptions/${hookId}`)
        .delete();
    },
    listItems({
      folderId, params = {},
    } = {}) {
      return this.client().api((folderId === "root")
        ? "/me/drive/root/children"
        : `/me/drive/items/${folderId}/children`)
        .get(params);
    },
    listTableRows({
      sheetId, tableId,
    } = {}) {
      return this.client().api(`/me/drive/items/${sheetId}/workbook/tables/${tableId}/rows`)
        .get();
    },
    // List tables endpoint is not supported for personal accounts
    listTables({
      sheetId, params = {},
    } = {}) {
      return this.client().api(`/me/drive/items/${sheetId}/workbook/tables`)
        .get(params);
    },
    listWorksheets({
      sheetId, params = {},
    } = {}) {
      return this.client().api(`/me/drive/items/${sheetId}/workbook/worksheets`)
        .get(params);
    },
    updateTableRow({
      sheetId, tableId, rowId, data = {},
    } = {}) {
      return this.client().api(`/me/drive/items/${sheetId}/workbook/tables/${tableId}/rows/ItemAt(index=${rowId})`)
        .patch(data);
    },
    updateSubscription({
      hookId, data = {},
    } = {}) {
      return this.client().api(`/subscriptions/${hookId}`)
        .patch(data);
    },
    batch({ data = {} } = {}) {
      return this.client().api("/$batch")
        .post(data);
    },
    getDriveItem({
      itemId, params = {},
    } = {}) {
      return this.client().api(`/me/drive/items/${itemId}`)
        .get(params);
    },
    getDelta({
      path, token, params = {},
    } = {}) {
      return this.client().api(`${path}/delta?token=${token}`)
        .get(params);
    },
    getRange({
      sheetId, worksheet, range, params = {},
    } = {}) {
      return this.client().api(`/me/drive/items/${sheetId}/workbook/worksheets/${worksheet}/range(address='${range}')`)
        .get(params);
    },
    getUsedRange({
      sheetId, worksheet, params = {},
    } = {}) {
      return this.client().api(`/me/drive/items/${sheetId}/workbook/worksheets/${worksheet}/usedRange`)
        .get(params);
    },
    insertRange({
      sheetId, worksheet, range, data = {},
    } = {}) {
      return this.client().api(`/me/drive/items/${sheetId}/workbook/worksheets/${worksheet}/range(address='${range}')/insert`)
        .post(data);
    },
    updateRange({
      sheetId, worksheet, range, data = {},
    } = {}) {
      return this.client().api(`/me/drive/items/${sheetId}/workbook/worksheets/${worksheet}/range(address='${range}')`)
        .patch(data);
    },
    async listFolderOptions({
      folderId = null, prefix = "", batchLimit = 20,
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
              data: {
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
