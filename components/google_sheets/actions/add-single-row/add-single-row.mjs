import googleSheets from "../../google_sheets.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "google_sheets-add-single-row",
  name: "Add Single Row",
  description: "Add a single row of data to Google Sheets",
  version: "2.0.8",
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
      description: "",
      withLabel: true,
    },
    sheetName: {
      propDefinition: [
        googleSheets,
        "sheetName",
        (c) => ({
          sheetId: c.sheetId?.value || c.sheetId,
        }),
      ],
      description: "",
    },
    hasHeaders: {
      type: "string",
      label: "Does the first row of the sheet have headers?",
      description: "If the first row of your document has headers we'll retrieve them to make it easy to enter the value for each column.",
      options: [
        "Yes",
        "No",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const sheetId = this.sheetId?.value || this.sheetId;
    const props = {};
    if (this.hasHeaders === "Yes") {
      const { values } = await this.googleSheets.getSpreadsheetValues(sheetId, `${this.sheetName}!1:1`);
      if (!values[0]?.length) {
        throw new ConfigurationError("Cound not find a header row. Please either add headers and click \"Refresh fields\" or adjust the action configuration to continue.");
      }
      for (let i = 0; i < values[0]?.length; i++) {
        props[`col_${i.toString().padStart(4, "0")}`] = {
          type: "string",
          label: values[0][i],
          optional: true,
        };
      }
    } else if (this.hasHeaders === "No") {
      props.myColumnData = {
        type: "string[]",
        label: "Values",
        description: "Provide a value for each cell of the row. Google Sheets accepts strings, numbers and boolean values for each cell. To set a cell to an empty value, pass an empty string.",
      };
    }
    return props;
  },
  async run({ $ }) {
    const sheetId = this.sheetId?.value || this.sheetId;
    let cells;
    if (this.hasHeaders === "Yes") {
      // TODO: If we could create a variable using this.allColumns in additionalProps, we dont need
      // to call getSpreadsheetValues here again.
      const { values: rows } = await this.googleSheets.getSpreadsheetValues(sheetId, `${this.sheetName}!1:1`);
      const [
        headers,
      ] = rows;
      cells = headers
        .map((_, i) => `col_${i.toString().padStart(4, "0")}`)
        .map((column) => this[column] ?? "");
    } else {
      cells = this.googleSheets.sanitizedArray(this.myColumnData);
    }

    // validate input
    if (!cells || !cells.length) {
      throw new Error("Please enter an array of elements in `Cells / Column Values`.");
    } else if (!Array.isArray(cells)) {
      throw new Error("Cell / Column data is not an array. Please enter an array of elements in `Cells / Column Values`.");
    } else if (Array.isArray(cells[0])) {
      throw new Error("Cell / Column data is a multi-dimensional array. A one-dimensional is expected. If you're trying to send multiple rows to Google Sheets, search for the action to add multiple rows to Sheets.");
    }

    const {
      arr,
      convertedIndexes,
    } = this.googleSheets.arrayValuesToString(cells);

    const data = await this.googleSheets.addRowsToSheet({
      spreadsheetId: sheetId,
      range: this.sheetName,
      rows: [
        arr,
      ],
    });

    let summary = `Added 1 row to [${this.sheetId?.label || this.sheetId} (${data.updatedRange})](https://docs.google.com/spreadsheets/d/${sheetId}).`;
    if (convertedIndexes.length > 0) {
      summary += " We detected something other than a string/number/boolean in at least one of the fields and automatically converted it to a string.";
    }
    $.export("$summary", summary);

    return data;
  },
};
