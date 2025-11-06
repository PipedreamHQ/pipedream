import app from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-move-dimension",
  name: "Move Dimension",
  description: "Move a dimension in a spreadsheet. [See the documentation](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#MoveDimensionRequest)",
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
      description: "The start (inclusive) of the span",
    },
    endIndex: {
      type: "integer",
      label: "End Index",
      description: "The end (exclusive) of the span",
    },
    destinationIndex: {
      type: "integer",
      label: "Destination Index",
      description: "The zero-based start index of where to move the source data to, based on the coordinates *before* the source data is removed from the grid. Existing data will be shifted down or right (depending on the dimension) to make room for the moved dimensions. The source dimensions are removed from the grid, so the the data may end up in a different index than specified. For example, given `A1..A5` of `0, 1, 2, 3, 4` and wanting to move `\"1\"` and `\"2\"` to between `\"3\"` and `\"4\"`, the source would be `ROWS [1..3)`,and the destination index would be `\"4\"` (the zero-based index of row 5). The end result would be `A1..A5` of `0, 3, 1, 2, 4`",
    },
  },
  async run({ $ }) {
    const response = await this.app.moveDimension( this.sheetId, {
      source: {
        dimension: this.dimension,
        startIndex: this.startIndex,
        endIndex: this.endIndex,
      },
      destinationIndex: this.destinationIndex,
    });
    $.export("$summary", "Successfully moved dimension");
    return response;
  },
};
