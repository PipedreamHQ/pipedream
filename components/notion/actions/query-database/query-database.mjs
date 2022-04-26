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
      description: "A filter is a single condition used to specify and limit the entries returned from a database query. Database queries can be filtered by page property values. [See the docs](https://developers.notion.com/reference/post-database-query-filter)",
      optional: true
    },
    sorts: {
      type: "object",
      description: "A sort is a condition used to order the entries returned from a database query. [See the docs](https://developers.notion.com/reference/post-database-query-sort)",
      optional: true
    }
  },
  async run({ $ }) {
    const params = { 
      filter: this.filter,
      sorts: this.sorts
    }
    const response = await this.notion.queryDatabase(this.databaseId, params);
    $.export("$summary", "Query Database successfully completed");

    return response;
  },
};
