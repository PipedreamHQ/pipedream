import notion from "../../notion.app.mjs";

export default {
  key: "notion-query-database",
  name: "Query Database",
  description: "Query a list of Pages from a Database [See the docs](https://developers.notion.com/reference/post-database-query)",
  version: "0.0.1",
  type: "action",
  props: {
    notion,
    databaseId: {
      propDefinition: [
        notion,
        "databaseId",
      ],
    },
    filter: {
      type: "object",
      description: "Filter Pages in the Database [See the docs](https://developers.notion.com/reference/post-database-query-filter)",
      optional: true
    },
    sorts: {
      type: "object",
      description: "Sort Pages in the Database [See the docs](https://developers.notion.com/reference/post-database-query-sort)",
      optional: true
    }
  },
  async run({ $ }) {
    const params = { filter, sorts }
    const response = await this.notion.queryDatabase(this.databaseId, params);
    $.export("$summary", "Query Database successfully");

    return response;
  },
};
