import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";
import {
  GRAPH_VERSION_PATH, ROOT_FOLDER_ID,
} from "./common/constants.mjs";
const DEFAULT_LIMIT = 50;

export default {
  type: "app",
  app: "microsoft_excel",
  propDefinitions: {
    driveId: {
      type: "string",
      label: "Drive ID",
      description: "The drive (document library) that holds the workbook. Leave empty to use your own OneDrive. To use a workbook stored in a SharePoint site, select its document library or pass a drive ID returned by **List Drive ID Options** (the `value` field). E.g. `b!-RIj2DuyvEyV1T4NlOaMHk8XkS_I8MdFlUCq1BlcjgmhRfAj3-Z8RY2VpuvV_tpd`",
      optional: true,
      async options() {
        return this.listDriveOptions();
      },
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "The ID of the folder where the item is located, in the selected drive. Use **List Folder ID Options** to find a folder ID (the `value` field), or `root` for the top of the drive. E.g. `01BYE5RZ6QN3ZWBTRWFNG2FOD7ONP4JLHU`",
      async options({ driveId }) {
        const folders = await this.listFolderOptions({
          driveId,
        });
        return [
          {
            label: "Root",
            value: ROOT_FOLDER_ID,
          },
          ...folders,
        ];
      },
    },
    sheetId: {
      type: "string",
      label: "Sheet ID",
      description: "The drive-item ID of the workbook (`.xlsx` file) you want to use, in the selected drive. Select it from the list, or pass the `id` returned by **Create Workbook**. E.g. `01BYE5RZ3JBLZSHHU2GBBJIVKZGW3P6ABE`",
      async options({
        folderId, driveId,
      }) {
        const { value } = await this.listItems({
          folderId,
          driveId,
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
      description: "The name of the worksheet (tab) in the workbook. Select it from the list, or pass the name exactly as it appears on the tab. E.g. `Sheet1`",
      async options({
        sheetId, driveId, page,
      }) {
        const limit = DEFAULT_LIMIT;
        const { value } = await this.listWorksheets({
          sheetId,
          driveId,
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
      description: "The zero-based index of the row in the table, not counting the header row. Select it from the list, or use the `index` of a row returned by **Get Table Rows**. E.g. `0`",
      async options({
        sheetId, tableId, driveId,
      }) {
        const { value } = await this.listTableRows({
          sheetId,
          tableId,
          driveId,
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
      description: "The ID of the table in the workbook. Select it from the list, which shows each table's name. E.g. `{9F3C4A1B-2D7E-4F60-8B1A-5C2E3D4F6A7B}`",
      async options({
        sheetId, driveId,
      }) {
        const { value } = await this.listTables({
          sheetId,
          driveId,
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
    _drivePath(driveId) {
      return driveId
        ? `/drives/${driveId}`
        : "/me/drive";
    },
    _folderChildrenPath(folderId, driveId) {
      return (!folderId || folderId === ROOT_FOLDER_ID)
        ? `${this._drivePath(driveId)}/root/children`
        : `${this._drivePath(driveId)}/items/${folderId}/children`;
    },
    client() {
      return Client.init({
        authProvider: (done) => {
          done(null, this.$auth.oauth_access_token);
        },
      });
    },
    addTableRow({
      sheetId, tableId, tableName, driveId, data = {},
    } = {}) {
      return this.client().api(`${this._drivePath(driveId)}/items/${sheetId}/workbook/tables/${tableId || tableName}/rows/add`)
        .post(data);
    },
    createItem({
      folderId, driveId, data = {},
    } = {}) {
      return this.client().api(this._folderChildrenPath(folderId, driveId))
        .post(data);
    },
    addWorksheet({
      sheetId, driveId, data = {},
    } = {}) {
      // Use the documented worksheetCollection: add action, matching addTableRow's
      // `/rows/add` pattern above. (A plain POST to the collection also works, but this
      // is the canonical endpoint.)
      return this.client().api(`${this._drivePath(driveId)}/items/${sheetId}/workbook/worksheets/add`)
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
      folderId, driveId, params = {},
    } = {}) {
      return this.client().api(this._folderChildrenPath(folderId, driveId))
        .get(params);
    },
    listTableRows({
      sheetId, tableId, driveId,
    } = {}) {
      return this.client().api(`${this._drivePath(driveId)}/items/${sheetId}/workbook/tables/${tableId}/rows`)
        .get();
    },
    // List tables endpoint is not supported for personal accounts
    listTables({
      sheetId, driveId, params = {},
    } = {}) {
      return this.client().api(`${this._drivePath(driveId)}/items/${sheetId}/workbook/tables`)
        .get(params);
    },
    listWorksheets({
      sheetId, driveId, params = {},
    } = {}) {
      return this.client().api(`${this._drivePath(driveId)}/items/${sheetId}/workbook/worksheets`)
        .get(params);
    },
    updateTableRow({
      sheetId, tableId, rowId, driveId, data = {},
    } = {}) {
      return this.client().api(`${this._drivePath(driveId)}/items/${sheetId}/workbook/tables/${tableId}/rows/ItemAt(index=${rowId})`)
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
      itemId, driveId, params = {},
    } = {}) {
      return this.client().api(`${this._drivePath(driveId)}/items/${itemId}`)
        .get(params);
    },
    getDelta({
      path, token, params = {},
    } = {}) {
      return this.client().api(`${path}/delta?token=${token}`)
        .get(params);
    },
    getRange({
      sheetId, worksheet, range, driveId, params = {},
    } = {}) {
      return this.client().api(`${this._drivePath(driveId)}/items/${sheetId}/workbook/worksheets/${worksheet}/range(address='${range}')`)
        .get(params);
    },
    getUsedRange({
      sheetId, worksheet, driveId, params = {},
    } = {}) {
      return this.client().api(`${this._drivePath(driveId)}/items/${sheetId}/workbook/worksheets/${worksheet}/usedRange`)
        .get(params);
    },
    insertRange({
      sheetId, worksheet, range, driveId, data = {},
    } = {}) {
      return this.client().api(`${this._drivePath(driveId)}/items/${sheetId}/workbook/worksheets/${worksheet}/range(address='${range}')/insert`)
        .post(data);
    },
    updateRange({
      sheetId, worksheet, range, driveId, data = {},
    } = {}) {
      return this.client().api(`${this._drivePath(driveId)}/items/${sheetId}/workbook/worksheets/${worksheet}/range(address='${range}')`)
        .patch(data);
    },
    async listAllPages(path) {
      const items = [];
      let next = path;
      while (next) {
        const response = await this.client().api(next)
          .get();
        items.push(...(response.value || []));
        next = response["@odata.nextLink"];
      }
      return items;
    },
    async listDriveOptions() {
      const options = [];
      let sites = [];
      try {
        sites = await this.listAllPages("/me/followedSites");
      } catch {
        // Listing sites needs Sites.Read.All; without it the Drive ID can still be entered by hand
        return options;
      }
      for (const site of sites) {
        const drives = await this.listAllPages(`/sites/${site.id}/drives`);
        drives.forEach(({
          id: value, name,
        }) => options.push({
          label: `${site.displayName || site.name} / ${name}`,
          value,
        }));
      }
      return options;
    },
    async listFolderOptions({
      folderId = null, driveId, prefix = "", batchLimit = 20,
    } = {}) {
      const options = [];
      const stack = [
        {
          folderId,
          prefix,
        },
      ];
      const history = [];

      while (stack.length) {
        const currentBatch = [];
        const pending = {};
        while (stack.length && currentBatch.length < batchLimit) {
          const {
            folderId,
            prefix,
            url,
          } = stack.shift();
          history.push({
            folderId,
            prefix,
          });
          const id = folderId || ROOT_FOLDER_ID;
          pending[id] = {
            folderId,
            prefix,
          };
          currentBatch.push({
            id,
            method: "GET",
            url: url || this._folderChildrenPath(folderId, driveId),
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
            const nextLink = body["@odata.nextLink"];
            if (nextLink) {
              const {
                pathname, search,
              } = new URL(nextLink);
              stack.push({
                ...pending[id],
                url: `${pathname.replace(GRAPH_VERSION_PATH, "")}${search}`,
              });
            }
            body.value.filter(({ folder }) => folder).forEach((item) => {
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
          } else if (id === ROOT_FOLDER_ID) {
            throw new Error(`Failed to list folders: ${JSON.stringify(body)}`);
          } else {
            console.error(`Error in batch request ${id}:`, JSON.stringify(body));
          }
        });
      }

      return options;
    },
  },
};
