import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-search",
  name: "Search",
  description:
    "Full-text search across all sheets or within a specific sheet."
    + " Returns matching rows, cells, and sheet names with context."
    + " To find a sheet by name, use **List Sheets** instead — this tool searches content within sheets."
    + " Provide a `sheetId` to scope the search to a single sheet, or omit it to search globally."
    + " This endpoint does not support pagination and caps out at roughly 50 results — the response's `totalCount`"
    + " field shows the true number of matches, so if `totalCount` is higher than the results returned, narrow"
    + " your query text or scope to a specific `sheetId` to surface the matches you need."
    + " Example: `{query: \"velociraptor\", sheetId: \"1234567890123456\"}` returns matching rows/cells from that"
    + " sheet only."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/search/list-search)",
  version: "0.0.3",
  type: "action",
  ai: "optimized",
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
      propDefinition: [
        smartsheet,
        "sheetId",
      ],
      description: "Optional — scope the search to a single sheet. Use **List Sheets** to find sheet IDs. If omitted, searches all sheets.",
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
