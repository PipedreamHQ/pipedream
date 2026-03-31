// vandelay-test-dr
import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-new-spreadsheet",
  name: "New Spreadsheet",
  description:
    "Create a new Google Spreadsheet with an optional worksheet"
    + " name and column headers."
    + " Returns the spreadsheet ID and URL."
    + " Use the spreadsheet ID with other tools to read/write"
    + " data.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    googleSheets,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the new spreadsheet.",
    },
    sheetName: {
      type: "string",
      label: "Worksheet Name",
      description:
        "Name for the first worksheet. Default: `Sheet1`.",
      optional: true,
    },
    headers: {
      type: "string[]",
      label: "Column Headers",
      description:
        "Column headers to add as row 1. Example:"
        + " `[\"Name\", \"Email\", \"Score\"]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const request = {
      requestBody: {
        properties: {
          title: this.title,
        },
      },
    };

    if (this.sheetName) {
      request.requestBody.sheets = [
        {
          properties: {
            title: this.sheetName,
          },
        },
      ];
    }

    const spreadsheet = await this.googleSheets
      .createSpreadsheet(request);

    const spreadsheetId = spreadsheet.spreadsheetId;
    const worksheetName = this.sheetName
      || spreadsheet.sheets?.[0]?.properties?.title
      || "Sheet1";

    // Add headers if specified
    if (this.headers?.length) {
      await this.googleSheets.addRowsToSheet({
        $,
        spreadsheetId,
        range: `'${worksheetName}'`,
        rows: [
          this.headers,
        ],
        params: {
          valueInputOption: "USER_ENTERED",
        },
      });
    }

    const url = "https://docs.google.com/spreadsheets/d/"
      + `${spreadsheetId}/edit`;

    $.export(
      "$summary",
      `Created spreadsheet "${this.title}"`,
    );

    return {
      spreadsheetId,
      title: this.title,
      url,
      worksheetName,
    };
  },
};
