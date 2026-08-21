// x-pd-ai: optimized
import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-list-spreadsheets",
  name: "List Spreadsheets",
  description:
    "List Google Spreadsheets accessible to the authenticated"
    + " user."
    + " Optionally search by name with `query`."
    + " Returns an array of `{ spreadsheetId, name, url }` whose"
    + " IDs can be used with all other tools."
    + " Returns up to `limit` results (default 20); when more"
    + " may exist the summary says so — raise `limit` to fetch"
    + " them.",
  version: "0.1.0",
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

    // Auto-paginate: follow Drive's nextPageToken until we have `limit`
    // results or run out of pages, so `limit` is honored across pages
    // rather than silently capped at the first page.
    const results = [];
    let pageToken = null;
    let more = false;
    do {
      const {
        options = [], context,
      } = await this.googleSheets
        .listSheetsOptions(
          null,
          pageToken,
          this.query || null,
        );

      for (const s of options) {
        if (results.length >= limit) {
          more = true;
          break;
        }
        results.push({
          spreadsheetId: s.value,
          name: s.label,
          url: `https://docs.google.com/spreadsheets/d/${s.value}/edit`,
        });
      }

      pageToken = context?.nextPageToken || null;
    } while (pageToken && results.length < limit);

    // Reached the cap with a page still pending → more remain unseen.
    if (results.length >= limit && pageToken) {
      more = true;
    }

    $.export(
      "$summary",
      more
        ? `Returning the first ${results.length} spreadsheets — more exist. Raise 'limit' to fetch them.`
        : `Found ${results.length} spreadsheet${
          results.length === 1
            ? ""
            : "s"}`,
    );

    return results;
  },
};
