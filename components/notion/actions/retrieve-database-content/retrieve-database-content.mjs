import notion from "../../notion.app.mjs";

export default {
  key: "notion-retrieve-database-content",
  name: "Retrieve Data Source Content",
  description: "Get all content of a data source. [See the documentation](https://developers.notion.com/reference/query-a-data-source)",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    notion,
    dataSourceId: {
      propDefinition: [
        notion,
        "dataSourceId",
      ],
    },
  },
  async run({ $ }) {
    const { results } = await this.notion.queryDataSource(this.dataSourceId);
    $.export("$summary", `Successfully retrieved ${results.length} object${results.length === 1
      ? ""
      : "s"} in data source`);
    return results;
  },
};
