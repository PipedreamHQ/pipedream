import notion from "../../notion.app.mjs";

export default {
  key: "notion-retrieve-database-content",
  name: "Retrieve Database Content",
  description: "Retreive the content of a database. [See the docs](https://developers.notion.com/reference/post-database-query)",
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
    const { results } = await this.notion.queryDatabase(this.databaseId);
    $.export("$summary", "Retrieved database content");
    return results;
  },
};
