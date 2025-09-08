import notion from "../../notion.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "notion-query-database",
  name: "Query Database",
  description: "Query a database with a specified filter. [See the documentation](https://developers.notion.com/reference/post-database-query)",
  version: "0.0.12",
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
      label: "Filter (query)",
      description: "The filter to apply, as a JSON-stringified object. [See the documentation for available filters](https://developers.notion.com/reference/post-database-query-filter). Example: `{ \"property\": \"Name\", \"title\": { \"contains\": \"title to search for\" } }`",
      type: "string",
    },
  },
  async run({ $ }) {
    const { filter } = this;

    const response = await this.notion.queryDatabase(this.databaseId, {
      filter: utils.parseStringToJSON(filter),
    });

    const length = response?.results?.length;

    $.export("$summary", `Retrieved ${length} result${length === 1
      ? ""
      : "s"}`);

    return response;
  },
};
