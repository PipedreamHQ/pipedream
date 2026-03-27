// vandelay-test-dr
import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-create-worksheet-ai",
  name: "Create Worksheet (AI)",
  description:
    "Add a new worksheet (tab) to an existing spreadsheet."
    + " Optionally set column headers."
    + " Use **Get Spreadsheet Info** to see existing worksheets"
    + " before creating.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    googleSheets,
    spreadsheetId: {
      type: "string",
      label: "Spreadsheet ID",
      description:
        "The spreadsheet ID from the Google Sheets URL.",
    },
    title: {
      type: "string",
      label: "Worksheet Title",
      description: "The name of the new worksheet (tab).",
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
    const worksheet = await this.googleSheets.createWorksheet(
      this.spreadsheetId,
      {
        title: this.title,
      },
    );

    // Add headers if specified
    if (this.headers?.length) {
      await this.googleSheets.addRowsToSheet({
        $,
        spreadsheetId: this.spreadsheetId,
        range: `'${this.title}'`,
        rows: [
          this.headers,
        ],
        params: {
          valueInputOption: "USER_ENTERED",
        },
      });
    }

    $.export(
      "$summary",
      `Created worksheet "${this.title}"`,
    );

    return worksheet;
  },
};
