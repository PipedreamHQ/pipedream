import googleSheets from "../../google_sheets.app.mjs";

const dataFormat = {
  type: "string",
  label: "Data Format",
  description: "You may enter individual values for each column or provide a single array representing the entire row. [See the docs here](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append)",
  options: [
    {
      label: "Enter a value for each column",
      value: "column",
    },
    {
      label: "Pass an array of values",
      value: "array",
    },
  ],
  reloadProps: true,
};

const headerProp = {
  type: "string",
  label: "Header Row?",
  description: "If the first row of your document has headers we'll retrieve them to make it easy to enter the value for each column.",
  options: [
    {
      label: "First row has headers",
      value: "hasHeaders",
    },
    {
      label: "There is no header row",
      value: "noHeaders",
    },
  ],
  reloadProps: true,
};

export default {
  key: "google_sheets-add-single-row",
  name: "Add Single Row",
  description: "Add a single row of data to Google Sheets",
  version: "1.0.1",
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
    sheetName: {
      propDefinition: [
        googleSheets,
        "sheetName",
        (c) => ({
          sheetId: c.sheetId,
        }),
      ],
    },
    dataFormat,
  },
  async additionalProps() {
    const props = {};
    if (this.dataFormat == "column") {
      props.header = headerProp;
      if (this.header === "hasHeaders") {
        const { values } = await this.googleSheets.getSpreadsheetValues(this.sheetId, `${this.sheetName}!1:1`);
        for (let i = 0; i < values[0]?.length; i++) {
          props[`col_${i.toString().padStart(4, "0")}`] = {
            type: "string",
            label: values[0][i],
            optional: true,
          };
        }
      } else if (this.header === "noHeaders") {
        props.myColumnData = {
          type: "string[]",
          label: "Row Data",
          description: "Provide a value for each cell of the row. Google Sheets accepts strings, numbers and boolean values for each cell. To set a cell to an empty value, pass an empty string.",
        };
      }
    } else if (this.dataFormat === "array") {
      props.arrayData = {
        type: "any",
        label: "Values",
        description: "Pass an array that represents a row of values. Each array element will be treated as a cell (e.g., entering `[\"Foo\",1,2]` will insert a new row of data with values in 3 cells). The most common pattern is to reference an array exported by a previous step (e.g., `{{steps.foo.$return_value}}`). Google Sheets accepts strings, numbers and boolean values for each cell. To set a cell to an empty value, pass an empty string.",
      };
    }
    return props;
  },
  async run({ $ }) {
    let cells;
    if (this.dataFormat === "column") {
      if (this.header === "hasHeaders") {
        cells = Object.keys(this).filter((prop) => prop.startsWith("col_"))
          .sort()
          .map((prop) => this[prop]);
      } else {
        cells = this.googleSheets.sanitizedArray(this.myColumnData);
      }
    } else {
      cells = this.googleSheets.sanitizedArray(this.arrayData);
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
      spreadsheetId: this.sheetId,
      range: this.sheetName,
      rows: [
        cells,
      ],
    });

    $.export("$summary", `Successfully added 1 row to [${data.updatedRange} in Google Sheets](https://docs.google.com/spreadsheets/d/${data.spreadsheetId})`);

    return data;
  },
};
