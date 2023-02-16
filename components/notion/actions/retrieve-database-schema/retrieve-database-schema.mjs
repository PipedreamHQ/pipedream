import notion from "../../notion.app.mjs";

export default {
  key: "notion-retrieve-database-schema",
  name: "Retrieve Database Schema",
  description: "Retrieves a database object. Database objects describe the property schema of a database in Notion. [See the docs](https://developers.notion.com/reference/retrieve-a-database)",
  version: "0.0.3",
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
    $.export("$summary", "Retrieved database successfully");
    return response;
  },
};
