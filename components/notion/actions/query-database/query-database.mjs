import utils from "../../common/utils.mjs";
import notion from "../../notion.app.mjs";

export default {
  key: "notion-query-database",
  name: "Query Data Source",
  description: "Query a data source with a specified filter. [See the documentation](https://developers.notion.com/reference/query-a-data-source)",
  version: "1.0.0",
  type: "action",
  props: {
    notion,
    dataSourceId: {
      propDefinition: [
        notion,
        "dataSourceId",
      ],
    },
    filter: {
      label: "Filter (query)",
      description: "The filter to apply, as a JSON-stringified object. [See the documentation for available filters](https://developers.notion.com/reference/filter-data-source-entries). Example: `{ \"property\": \"Name\", \"title\": { \"contains\": \"title to search for\" } }`",
      type: "string",
    },
    sorts: {
      label: "Sorts",
      description: "The sort order for the query. [See the documentation for available sorts](https://developers.notion.com/reference/sort-data-source-entries). Example: `[ { \"property\": \"Name\", \"direction\": \"ascending\" } ]`",
      type: "string[]",
    },
  },
  async run({ $ }) {
    const {
      filter, sorts,
    } = this;

    const response = await this.notion.queryDataSource(this.dataSourceId, {
      filter: utils.parseStringToJSON(filter),
      sorts: utils.parseObject(sorts),
    });

    const length = response?.results?.length;

    $.export("$summary", `Retrieved ${length} result${length === 1
      ? ""
      : "s"}`);

    return response;
  },
};
