import notion from "../../notion.app.mjs";

export default {
  key: "notion-retrieve-database-schema",
  name: "Retrieve Database Schema",
  description: "Get the property schema of a database in Notion. [See the documentation](https://developers.notion.com/reference/retrieve-a-database)",
  version: "0.0.9",
  type: "action",
  props: {
    notion,
    databaseId: {
      propDefinition: [
        notion,
        "databaseId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.notion.retrieveDatabase(this.databaseId);
    $.export("$summary", "Successfully retrieved database schema");
    return response;
  },
};
