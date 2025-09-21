import { v4 as uuid } from "uuid";
import common from "../common/worksheet.mjs";
import { VALUE_RENDER_OPTION } from "../../common/constants.mjs";
import {
  omitEmptyKey, toSingleLineString,
} from "../../common/utils.mjs";

const { googleSheets } = common.props;

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
  ...common,
  key: "google_sheets-upsert-row",
  name: "Upsert Row",
  description: "Upsert a row of data in a Google Sheet. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append)",
  version: "0.1.15",
  type: "action",
  props: {
    googleSheets,
    drive: {
      propDefinition: [
        googleSheets,
        "watchedDrive",
      ],
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
    worksheetId: {
      propDefinition: [
        googleSheets,
        "worksheetIDs",
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
      label: "Insert - Cells / Column Values",
      description: toSingleLineString(`
        Insert statement: the row data you want to add to the Google sheet if the key *doesn't*
        exist. If the key *does* exist and **Update** is not set, the row will be updated using
        this array.
        Enter individual cell values or enter a custom expression to pass an
        array with each element representing a cell/column value (e.g. \`{{ [5, "test"] }}\`).
      `),
    },
    column: {
      propDefinition: [
        googleSheets,
        "column",
      ],
      label: "Key Column",
      description: "The column of the sheet to lookup (e.g. `A`). This column functions as the key column for the upsert operation.",
    },
    value: {
      type: "string",
      label: "Key Value",
      description: "The value of the key to search for in **Key Column**. Defaults to the value in **Insert**'s \"key\" column if left blank.",
      optional: true,
    },
    updates: {
      type: "object",
      label: "Update - Column / Values",
      description: toSingleLineString(`
        Update statment: if the spreadsheet contains duplicate key **Value** in some row in
        the specified **Column**, individual cells in the *first* duplicate row will be updated using
        this object's column-value pairs.<br />
        Enter the column name for the key (e.g. \`B\`) and the corresponding column value (e.g.
        \`test\`). You may also enter a custom expression and pass a JSON object with key/value pairs
        representing columns and values (e.g. \`{{ { A: 5, B: "test" } }}\`).
      `),
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      sheetId,
      worksheetId,
      insert,
      column,
      value,
      updates,
    } = this;
    const worksheet = await this.getWorksheetById(sheetId, worksheetId);
    const colIndex = this.googleSheets._getColumnIndex(column) - 1;
    const keyValue = value
      ? value
      : insert[colIndex];

    // Create hidden worksheet to add cell with `=MATCH()` formula, used to find duplicate key
    const hiddenWorksheetTitle = uuid();
    const addSheetResult = await this.googleSheets.createWorksheet(sheetId, {
      title: hiddenWorksheetTitle,
      hidden: true,
      gridProperties: {
        rowCount: 2,
        columnCount: 1,
      },
    });
    const hiddenSheetId = addSheetResult.properties.sheetId;

    try {
      const matchResult = await this.googleSheets.addRowsToSheet({
        spreadsheetId: sheetId,
        range: hiddenWorksheetTitle,
        rows: [
          [
            keyValue, // A1
          ],
          [
            this.googleSheets.buildMatchFormula("A1", worksheet?.properties?.title, {
              column,
              searchType: 0,
            }), // A2
          ],
        ],
        params: {
          includeValuesInResponse: true,
          responseValueRenderOption: VALUE_RENDER_OPTION.FORMATTED_VALUE,
        },
      });

      const matchedRow = matchResult.updatedData?.values?.[1]?.[0]; // A2

      const shouldUpdate = matchedRow && matchedRow !== "#N/A";

      if (!shouldUpdate) {
        // INSERT ROW
        const result = await this.googleSheets.addRowsToSheet({
          spreadsheetId: sheetId,
          range: worksheet?.properties?.title,
          rows: [
            insert,
          ],
        });
        $.export("$summary", `Couldn't find the key, "${keyValue}", so inserted new row: "${insert}"`);
        return result;
      }

      // UPDATE ROW
      const updateParams = [
        sheetId,
        worksheet?.properties?.title,
        matchedRow,
      ];
      const sanitizedUpdates = omitEmptyKey(updates);
      const updateRowCells = sanitizedUpdates && Object.keys(sanitizedUpdates).length;
      const updatePromise =
      updateRowCells
        ? this.googleSheets.updateRowCells(...updateParams, sanitizedUpdates)
        : this.googleSheets.updateRow(...updateParams, insert);

      const result = await updatePromise;
      $.export("$summary", `Successfully updated row ${matchedRow}`);
      return result;
    } finally {
      // Cleanup hidden worksheet
      await this.googleSheets.deleteWorksheet(sheetId, hiddenSheetId);
    }
  },
};
