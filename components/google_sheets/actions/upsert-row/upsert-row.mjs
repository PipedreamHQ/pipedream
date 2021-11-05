import { v4 as uuid } from "uuid";
import googleSheets from "../../google_sheets.app.mjs";

/**
 * This action performs an upsert operation, similar to the MySQL `INSERT INTO ... ON DUPLICATE KEY
 * UPDATE` operation, on a Google Spreadsheet. If a row in the spreadsheet has `value` in `column`
 * (i.e., a duplicated key), that row is updated. Otherwise, a new row is appended to the
 * spreadsheet.
 *
 * To determine if and where a duplicate key exists in the spreadsheet, this action uses [Google
 * Sheet's `MATCH` function](https://support.google.com/docs/answer/3093378) in a new temporary
 * hidden worksheet. Uses roughly the method described in [this stackoverflow
 * answer](https://stackoverflow.com/a/49439220) and [this GitHub
 * comment](https://github.com/PipedreamHQ/pipedream/issues/1824#issuecomment-949940177).
 */
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
      description: "Insert statement: the row data you want to add to the Google sheet if the key *doesn't* exist. If the key *does* exist and **Update** is not set, the row will be updated using this array. Use structured mode to enter individual cell values. Disable structured mode to pass an array with each element representing a cell/column value (e.g. `{{ [5, \"test\"] }}`).",
    },
    column: {
      propDefinition: [
        googleSheets,
        "column",
      ],
      description: "The column of the sheet to lookup (e.g. `A`). This column functions as the key column for the upsert operation.",
    },
    value: {
      type: "string",
      label: "Value",
      description: "The value of the key to search for in **Column**. Defaults to the value in **Insert**'s \"key\" column if left blank.",
      optional: true,
    },
    updates: {
      type: "object",
      label: "Update",
      description: "Update statment: if the spreadsheet contains duplicate key **Value** in some row in specified **Column**, individual cells in the *first* duplicate row will be updated using this object's column-value pairs. Enter the column name for the key and the corresponding column value. You may also disable structured mode to pass a JSON object with key/value pairs representing columns and values (e.g. `{{ { A: 5, B: \"test\" } }}`).",
      optional: true,
    },
  },
  methods: {
    /**
     * https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/request#UpdateCellsRequest
     *
     * @param {string} sheetName - Name of the worksheet
     * @param {number} row - The row number (>=1) of the cell to update
     * @param {string} column - The column letter of the cell to update
     * @param {string} value - The new value of the cell
     * @returns An UpdateCellsRequest object
     */
    getUpdateRequestData(sheetName, row, column, value) {
      return {
        range: `${sheetName}!${column}${row}:${column}${row}`,
        values: [
          [
            value,
          ],
        ],
      };
    },
    /**
     * https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/request#AddSheetRequest
     *
     * Creates a worksheet and returns the properties of the newly created sheet
     * @param {string} spreadsheetId - ID of the spreadsheet in which to create a worksheet
     * @param {object} properties - The properties the new sheet should have
     * @returns An object containing the SheetProperties (`properties`) of the newly created sheet
     */
    async addSheet(spreadsheetId, properties) {
      return (await this.googleSheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties,
              },
            },
          ],
        },
      })).replies[0].addSheet;
    },
    /**
     * https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/request#DeleteSheetRequest
     *
     * Deletes a worksheet
     * @param {string} spreadsheetId - ID of the spreadsheet
     * @param {string} sheetId - ID of the worksheet to delete
     */
    async deleteSheet(spreadsheetId, sheetId) {
      return (await this.googleSheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              deleteSheet: {
                sheetId,
              },
            },
          ],
        },
      })).replies[0].deleteSheet;
    },
    /**
     * Updates individual cells in a row using column-value pairs
     *
     * @param {string} spreadsheetId - ID of the spreadsheet
     * @param {string} sheetName - Name of the worksheet
     * @param {number} row - The row in which to update cells
     * @param {object} updates - An object whose keys are column letters and values are new cell
     * values
     * @returns An object containing an array of UpdateValuesResponse (`responses`)
     */
    async updateRowCells(spreadsheetId, sheetName, row, updates) {
      const updateData = Object.keys(updates)
        .map((k) => this.getUpdateRequestData(sheetName, row, k, updates[k]));
      return await this.googleSheets.batchUpdateValues(
        spreadsheetId,
        updateData,
        {
          valueInputOption: "USER_ENTERED",
        },
      );
    },
    /**
     * Updates a row in a spreadsheet and returns a response body containing an instance of
     * UpdateValuesResponse
     * @param {string} spreadsheetId - ID of the spreadsheet
     * @param {string} sheetName - Name of the worksheet
     * @param {number} row - Row number to update
     * @param {string[]} values - Array of values with which to update the row
     * @returns An instance of UpdateValuesResponse
     */
    async updateRow(spreadsheetId, sheetName, row, values) {
      return await this.googleSheets.updateSpreadsheet({
        spreadsheetId,
        range: `${sheetName}!${row}:${row}`,
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [
            values,
          ],
        },
      });
    },
  },
  async run({ $ }) {
    const {
      sheetId,
      sheetName,
      insert,
      column,
      value,
      updates,
    } = this;
    const colIndex = this.googleSheets._getColumnIndex(column) - 1;
    const keyValue = value
      ? value
      : insert[colIndex];

    // Create hidden worksheet to add cell with `=MATCH()` formula, used to find duplicate key
    const hiddenWorksheetTitle = uuid();
    const addSheetResult = await this.addSheet(sheetId, {
      title: hiddenWorksheetTitle,
      hidden: true,
      gridProperties: {
        rowCount: 1,
        columnCount: 1,
      },
    });
    const hiddenSheetId = addSheetResult.properties.sheetId;

    // Add cell with `=MATCH("<value>", <sheet>!<column>...)` formula to hidden worksheet
    const matchResult = await this.googleSheets.addRowsToSheet({
      spreadsheetId: sheetId,
      range: hiddenWorksheetTitle,
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

    const matchedRow = matchResult.updatedData?.values?.[0]?.[0];

    const deleteSheetPromise = this.deleteSheet(sheetId, hiddenSheetId);

    let result; // Return value of this action

    const shouldUpdate = matchedRow && matchedRow !== "#N/A";

    if (shouldUpdate) {
      // UPDATE ROW
      if (updates && Object.keys(updates).length) { // (`updates` prop)
        result = await this.updateRowCells(sheetId, sheetName, matchedRow, updates);
      } else {
        result = await this.updateRow(sheetId, sheetName, matchedRow, insert);
      }
    } else {
      // INSERT ROW
      result = await this.googleSheets.addRowsToSheet({
        spreadsheetId: this.sheetId,
        range: this.sheetName,
        rows: [
          insert,
        ],
      });
    }

    await deleteSheetPromise;

    if (shouldUpdate) {
      $.export("$summary", `Successfully updated row ${matchedRow} with key, "${keyValue}"`);
    } else {
      $.export("$summary", `Successfully inserted row with key, "${keyValue}"`);
    }
    return result;
  },
};
