import app from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-insert-anchored-note",
  name: "Insert an Anchored Note",
  description: "Insert a note on a spreadsheet cell. [See the docs here](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/batchUpdate)",
  version: "0.0.1",
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
        "fileId",
        ({ drive }) => ({
          drive,
          baseOpts: {
            q: "mimeType = 'application/vnd.google-apps.spreadsheet'",
          },
        }),
      ],
    },
    row: {
      type: "integer",
      label: "Row",
      description: "The row where the comment will be inserted.",
      min: 1,
    },
    column: {
      type: "integer",
      label: "Column",
      description: "The column where the comment will be inserted.",
      min: 1,
    },
    content: {
      type: "string",
      label: "Comment",
      description: "The comment to add to the spreadsheet.",
    },
  },
  async run({ $: step }) {
    const {
      sheetId,
      content,
      row,
      column,
    } = this;

    const request = {
      spreadsheetId: sheetId,
      requestBody: {
        requests: [
          {
            updateCells: {
              range: {
                startRowIndex: row - 1,
                endRowIndex: row,
                startColumnIndex: column - 1,
                endColumnIndex: column,
              },
              rows: [
                {
                  values: [
                    {
                      note: content,
                    },
                  ],
                },
              ],
              fields: "note",
            },
          },
        ],
      },
    };
    const response = await this.app.batchUpdate(request);

    step.export("$summary", `Successfully added a note to the spreadsheet. Row: "${row}" Column: "${column}"`);

    return response;
  },
};
