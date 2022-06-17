import notion from "../../notion.app.mjs";

export default {
  key: "notion-retrieve-database",
  name: "Retrieve Database",
  description: "Retrieves a database. [See the docs](https://developers.notion.com/reference/retrieve-a-database)",
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
  },
  async run({ $ }) {
    const response = await this.notion.retrieveDatabase(this.databaseId);
    $.export("$summary", "Retrieved database successfully");
    return response;
  },
};
