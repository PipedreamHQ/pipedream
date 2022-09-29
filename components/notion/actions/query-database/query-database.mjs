import notion from "../../notion.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "notion-query-database",
  name: "Query Database",
  description: "Query a database. [See the docs](https://developers.notion.com/reference/post-database-query)",
  version: "0.0.4",
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
    sorts: {
      label: "Sorts",
      description: "The array of sorting option objects. [See how sort work here](https://developers.notion.com/reference/post-database-query-sort). E.g. [ { \"property\": \"Food group\", \"direction\": \"descending\" }, { \"property\": \"Name\", \"direction\": \"ascending\" } ]",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const { filter, sorts } = this;

    const response = await this.notion.queryDatabase(this.databaseId, {
      filter: utils.parseStringToJSON(filter),
      sorts: utils.parseStringToJSON(sorts),
    });

    $.export("$summary", "Retrieved database query result");

    return response;
  },
};
