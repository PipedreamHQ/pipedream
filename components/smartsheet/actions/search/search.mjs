// x-pd-ai: optimized
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-search",
  name: "Search",
  description:
    "Full-text search across everything the account can see, or within a single sheet."
    + " This is the fastest way to find a sheet by name: results include whole objects, not just cell contents -"
    + " each result carries an `objectType` of `sheet`, `row`, `folder`, `workspace`, `report`, `template`,"
    + " `attachment`, `discussion`, `sight` or `summaryField`, and its `objectId` is that object's ID."
    + " So a result with `objectType: \"sheet\"` gives you the sheet ID directly in one call."
    + " Prefer this over **List Sheets** when you know part of a name; use **List Sheets** to enumerate everything"
    + " or when you need each sheet's permalink."
    + " Searching by a sheet URL does not work - the URL token is not indexed text; pass the URL to **Get Sheet** instead,"
    + " which resolves it for you."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/search/list-search)",
  version: "0.0.4",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    smartsheet,
    query: {
      type: "string",
      label: "Search Query",
      description: "The text to search for across sheet contents.",
    },
    sheetId: {
      type: "string",
      label: "Sheet ID",
      description: "Optional - scope the search to a single sheet (e.g. `1234567890123456`). Use **List Sheets** to find sheet IDs. If omitted, searches all sheets.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      query: this.query,
    };

    let response;
    if (this.sheetId) {
      response = await this.smartsheet.searchSheet(this.sheetId, {
        $,
        params,
      });
    } else {
      response = await this.smartsheet.searchAll({
        $,
        params,
      });
    }

    const totalResults = response.totalCount ?? response.results?.length ?? 0;
    const scope = this.sheetId
      ? `sheet ${this.sheetId}`
      : "all sheets";
    $.export("$summary", `Found ${totalResults} result(s) for "${this.query}" in ${scope}`);
    return response;
  },
};
