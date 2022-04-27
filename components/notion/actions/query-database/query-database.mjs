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
      description: "The filter to query. [See how fitler works here](https://developers.notion.com/reference/post-database-query-filter)",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.notion.queryDatabase(this.databaseId, {
      filter: JSON.parse(this.filter),
    });

    $.export("$summary", "Retrieved database query result");

    return response;
  },
};
