import app from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-find-row-vlookup",
  name: "Find Row Vlookup",
  description: "Find one or more rows by the first column value and a search text using [VLOOKUP](https://support.google.com/docs/answer/3093318) formula",
  version: "0.0.2",
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
    sheetName: {
      propDefinition: [
        app,
        "sheetName",
        (c) => ({
          sheetId: c.sheetId,
        }),
      ],
    },
    range: {
      description: "The upper and lower values to consider for the search. Eg `A1:C5`",
      propDefinition: [
        app,
        "range",
      ],
    },
    searchValue: {
      type: "string",
      label: "Search Value",
      description: "The value to search for in the first column of the **Range**.",
    },
  },
  methods: {
    isRangeValid(range) {
      return range?.match(/^[A-Z]+\d+:[A-Z]+\d+$/);
    },
  },
  async run() {
    const {
      app,
      sheetId,
      sheetName,
      range,
      searchValue,
    } = this;

    const sheets = app.sheets();

    const validRange = this.isRangeValid(range)
      ? range
      : `${range}:${range}`;

    const { data: { values } } =
      await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${sheetName}!${validRange}`,
      });

    return values.reduce((acc, row, index) => {
      if (row[0] === searchValue) {
        return acc.concat({
          row,
          index,
          googleSheetsRowNumber: index + 1,
        });
      }
      return acc;
    }, []);
  },
};
