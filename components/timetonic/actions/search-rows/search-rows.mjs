import timetonic from "../../timetonic.app.mjs";

export default {
  key: "timetonic-search-rows",
  name: "Search Rows",
  description: "Perform a search across table rows based on given criteria.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    timetonic,
    tableId: {
      propDefinition: [
        timetonic,
        "tableId",
      ],
    },
    query: {
      propDefinition: [
        timetonic,
        "query",
      ],
    },
    limit: {
      propDefinition: [
        timetonic,
        "limit",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.timetonic.searchTableRows(this.tableId, this.query, this.limit);
    $.export("$summary", `Found ${response.length} matching rows`);
    return response;
  },
};
