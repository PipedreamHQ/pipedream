import notion from "../../notion.app.mjs";

export default {
  key: "notion-retrieve-database-content",
  name: "Retrieve Data Source Content",
  description: "Get all content of a data source. [See the documentation](https://developers.notion.com/reference/query-a-data-source)",
  version: "1.0.0",
  type: "action",
  props: {
    notion,
    databaseId: {
      propDefinition: [
        notion,
        "databaseId",
      ],
    },
    dataSourceId: {
      propDefinition: [
        notion,
        "dataSourceId",
        ({ databaseId }) => ({
          databaseId,
        }),
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
