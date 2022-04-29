import notion from "../../notion.app.mjs";

export default {
  key: "notion-query-database",
  name: "Query Databse",
  description: "Query a database. [See the docs](https://developers.notion.com/reference/post-database-query)",
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
      label: "Filter",
      description: "The filter to query. [See how to filters works here](https://developers.notion.com/reference/post-database-query-filter)",
      type: "object",
    },
  },
  async run({ $ }) {
    const { filter } = this;

    const objectFilter = typeof filter === "string"
      ? JSON.parse(filter)
      : filter;

    const response = await this.notion.queryDatabase(this.databaseId, {
      filter: objectFilter,
    });

    $.export("$summary", "Retrieved database query result");

    return response;
  },
};
