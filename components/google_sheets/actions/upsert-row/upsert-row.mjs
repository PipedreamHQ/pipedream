import { v4 as uuid } from "uuid";
import googleSheets from "../../google_sheets.app.js";

export default {
  key: "google_sheets-upsert-row",
  name: "Upsert Row",
  description: "Upsert a row of data in a Google Sheet",
  version: "0.0.1",
  type: "action",
  props: {
    googleSheets,
    drive: {
      propDefinition: [
        googleSheets,
        "watchedDrive",
      ],
      description: "",
      optional: true,
    },
    sheetId: {
      propDefinition: [
        googleSheets,
        "sheetID",
        (c) => ({
          driveId: googleSheets.methods.getDriveId(c.drive),
        }),
      ],
    },
    sheetName: {
      propDefinition: [
        googleSheets,
        "sheetName",
        (c) => ({
          sheetId: c.sheetId,
        }),
      ],
    },
    insert: {
      propDefinition: [
        googleSheets,
        "cells",
      ],
      label: "Insert",
    },
    column: {
      propDefinition: [
        googleSheets,
        "column",
      ],
    },
    value: {
      type: "string",
      label: "Value",
      description: "The value to search for",
      optional: true,
    },
    update: {
      type: "object",
      label: "update",
      description: "An object of Google Sheets column-value pairs",
      optional: true,
    },
  },
  methods: {
    async getSheetId(sheetName = this.sheetName, spreadsheetId = this.sheetId) {
      const request = {
        spreadsheetId: spreadsheetId,
        ranges: [
          sheetName,
        ],
        includeGridData: false,
      };
      const res = await this.googleSheets.sheets().spreadsheets.get(request);
      return res.data.sheets[0].properties.sheetId;
    },
    getUpdateRequest(sheetId, row, column, value) {
      const colIndex = this.googleSheets._getColumnIndex(column) - 1;
      return {
        "updateCells":
        {
          "range": {
            "sheetId": sheetId,
            "startRowIndex": row - 1,
            "endRowIndex": row,
            "startColumnIndex": colIndex,
            "endColumnIndex": colIndex + 1,
          },
          "rows": [
            {
              "values": [
                {
                  "userEnteredValue": {
                    "stringValue": value,
                  },
                },
              ],
            },
          ],
          "fields": "*",
        },
      };
    },
  },
  async run() {
    const {
      sheetId,
      sheetName,
      insert,
      column,
      value,
      update,
    } = this;
    const colIndex = this.googleSheets._getColumnIndex(column) - 1;
    const keyValue = value
      ? value
      : insert[colIndex];

    // Create worksheet title
    const title = uuid();
    // Create hidden worksheet
    const addSheetRequest = {
      spreadsheetId: sheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title,
                hidden: true,
                gridProperties: {
                  rowCount: 1,
                  columnCount: 1,
                },
              },
            },
          },
        ],
      },
    };
    const data = await this.googleSheets.batchUpdate(addSheetRequest);
    const hiddenSheetId = data.replies[0].addSheet.properties.sheetId;

    // Add cell with match formula to hidden worksheet
    const matchData = await this.googleSheets.addRowsToSheet({
      spreadsheetId: sheetId,
      range: title,
      rows: [
        [
          `=MATCH("${keyValue}", ${sheetName}!${column}:${column}, 0)`,
        ],
      ],
      params: {
        includeValuesInResponse: true,
        responseValueRenderOption: "FORMATTED_VALUE",
      },
    });

    // Get matching row where the cell's value === `value`
    const matchedRow = matchData.updatedData?.values?.[0]?.[0];

    let result; // Return value of this action

    // If there's a row with matching value, update that row. Else, append new row.
    if (matchedRow && matchedRow !== "#N/A") {
      // If the `update` prop is set, update cells using `batchUpdate`
      if (update) {
        const worksheetId = await this.getSheetId();
        const updateRequests = Object.keys(update)
          .map((k) => this.getUpdateRequest(worksheetId, matchedRow, k, update[k]));
        const batchUpdateRequest = {
          spreadsheetId: sheetId,
          requestBody: {
            requests: updateRequests,
          },
        };
        result = await this.googleSheets.batchUpdate(batchUpdateRequest);
      // Else the `update` prop isn't set, so update rows with `updateSpreadsheet`
      } else {
        const updateRowRequest = {
          spreadsheetId: this.sheetId,
          range: `${sheetName}!${matchedRow}:${matchedRow}`,
          valueInputOption: "USER_ENTERED",
          resource: {
            values: [
              insert,
            ],
          },
        };
        result = await this.googleSheets.updateSpreadsheet(updateRowRequest);
      }
    } else {
      result = await this.googleSheets.addRowsToSheet({
        spreadsheetId: this.sheetId,
        range: this.sheetName,
        rows: [
          insert,
        ],
      });
    }

    // Delete hidden worksheet
    const deleteSheetRequest = {
      spreadsheetId: this.sheetId,
      requestBody: {
        requests: [
          {
            deleteSheet: {
              sheetId: hiddenSheetId,
            },
          },
        ],
      },
    };
    await this.googleSheets.batchUpdate(deleteSheetRequest);
    return result;
  },
};
