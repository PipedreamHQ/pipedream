import notion from "../../notion.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "notion-query-database",
  name: "Query Database",
  description: "Query a database. [See the docs](https://developers.notion.com/reference/post-database-query)",
  version: "0.0.6",
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
      description: "The filter to query. [See how filters work here](https://developers.notion.com/reference/post-database-query-filter). E.g. { \"property\": \"Email\", \"rich_text\": { \"contains\": \"gmail.com\" } }",
      type: "string",
    },
  },
  async run({ $ }) {
    const { filter } = this;

    const response = await this.notion.queryDatabase(this.databaseId, {
      filter: utils.parseStringToJSON(filter),
    });

    $.export("$summary", "Retrieved database query result");

    return response;
  },
};
