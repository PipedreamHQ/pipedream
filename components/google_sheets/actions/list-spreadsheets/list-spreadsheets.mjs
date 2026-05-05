// vandelay-test-dr
import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-list-spreadsheets",
  name: "List Spreadsheets",
  description:
    "List Google Spreadsheets accessible to the authenticated"
    + " user."
    + " Optionally search by name."
    + " Returns spreadsheet IDs that can be used with all other"
    + " tools.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    googleSheets,
    query: {
      type: "string",
      label: "Search Query",
      description:
        "Search spreadsheets by name. Leave empty to list all.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description:
        "Maximum number of spreadsheets to return. Default: 20.",
      optional: true,
    },
  },
  async run({ $ }) {
    const limit = this.limit || 20;

    const { options: spreadsheets } = await this.googleSheets
      .listSheetsOptions(
        null,
        null,
        this.query || null,
      );

    const results = (spreadsheets || []).slice(0, limit).map((s) => ({
      spreadsheetId: s.value,
      name: s.label,
      url: `https://docs.google.com/spreadsheets/d/${s.value}/edit`,
    }));

    $.export(
      "$summary",
      `Found ${results.length} spreadsheet${
        results.length === 1
          ? ""
          : "s"}`,
    );

    return results;
  },
};
