import notion from "../../notion.app.mjs";

export default {
  key: "notion-retrieve-database-schema",
  name: "Retrieve Data Source Schema",
  description: "Get the property schema of a data source in Notion. [See the documentation](https://developers.notion.com/reference/retrieve-a-data-source)",
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
  },
  async run({ $ }) {
    const response = await this.notion.retrieveDataSource(this.dataSourceId);
    $.export("$summary", "Successfully retrieved data source schema");
    return response;
  },
};
