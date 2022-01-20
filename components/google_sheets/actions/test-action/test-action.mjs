import googleSheets from "../../google_sheets.app.mjs";

const headerProp = {
  type: "string",
  label: "Does the first row of the sheet have headers?",
  description: "If the first row of your document has headers we'll retrieve them to make it easy to enter the value for each column.",
  options: [
    "Yes",
    "No",
  ],
  reloadProps: true,
};

export default {
  key: "google_sheets-test-action",
  name: "Test Action",
  description: "Test Action",
  version: "0.0.8",
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
      label: "Spreadsheet ID",
      description: "",
      withLabel: true,
    },
    sheetName: {
      propDefinition: [
        googleSheets,
        "sheetName",
        (c) => ({
          sheetId: c.sheetId?.value,
        }),
      ],
      description: "",
    },
    headerProp,
  },
  async additionalProps() {
    const props = {};
    if (this.headerProp === "Yes") {
      const { values } = await this.googleSheets.getSpreadsheetValues(this.sheetId.value, `${this.sheetName}!1:1`);
      for (let i = 0; i < values[0]?.length; i++) {
        props[`col_${i.toString().padStart(4, "0")}`] = {
          type: "string",
          label: values[0][i],
          optional: true,
        };
      }
    } else if (this.headerProp === "No") {
      props.myColumnData = {
        type: "string[]",
        label: "Values",
        description: "Provide a value for each cell of the row. Google Sheets accepts strings, numbers and boolean values for each cell. To set a cell to an empty value, pass an empty string.",
      };
    }
    return props;
  },
  async run({ $ }) {
    let cells;
    if (this.headerProp === "Yes") {
      cells = Object.keys(this).filter((prop) => prop.startsWith("col_"))
        .sort()
        .map((prop) => this[prop]);
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

    const data = await this.googleSheets.addRowsToSheet({
      spreadsheetId: this.sheetId.value,
      range: this.sheetName,
      rows: [
        cells,
      ],
    });

    $.export("$summary", `**Added 1 row to [${this.sheetId.label} (${data.updatedRange})](https://docs.google.com/spreadsheets/d/${this.sheetId.value})**`);

    return data;
  },
};
