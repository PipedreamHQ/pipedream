import app from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-insert-dimension",
  name: "Insert Dimension",
  description: "Insert a dimension into a spreadsheet. [See the documentation](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#InsertDimensionRequest)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    drive: {
      propDefinition: [
        app,
        "watchedDrive",
      ],
    },
    sheetId: {
      propDefinition: [
        app,
        "sheetID",
        (c) => ({
          driveId: app.methods.getDriveId(c.drive),
        }),
      ],
    },
    dimension: {
      type: "string",
      label: "Dimension",
      description: "The dimension to insert",
      options: [
        {
          label: "Operates on the rows of a sheet",
          value: "ROWS",
        },
        {
          label: "Operates on the columns of a sheet",
          value: "COLUMNS",
        },
      ],
    },
    startIndex: {
      type: "integer",
      label: "Start Index",
      description: "The start (inclusive) of the span, or not set if unbounded",
      optional: true,
    },
    endIndex: {
      type: "integer",
      label: "End Index",
      description: "The end (exclusive) of the span",
    },
    inheritFromBefore: {
      type: "boolean",
      label: "Inherit From Before",
      description: `Whether dimension properties should be extended from the dimensions before or after the newly inserted dimensions. True to inherit from the dimensions before (in which case the start index must be greater than 0), and false to inherit from the dimensions after.
For example, if row index 0 has red background and row index 1 has a green background, then inserting 2 rows at index 1 can inherit either the green or red background. If **inheritFromBefore** is true, the two new rows will be red (because the row before the insertion point was red), whereas if **inheritFromBefore** is false, the two new rows will be green (because the row after the insertion point was green).`,
      default: false,
    },
  },
  async run({ $ }) {
    const response = await this.app.insertDimension( this.sheetId, {
      range: {
        dimension: this.dimension,
        startIndex: this.startIndex,
        endIndex: this.endIndex,
      },
      inheritFromBefore: this.inheritFromBefore,
    });
    $.export("$summary", "Successfully inserted dimension request");
    return response;
  },
};
