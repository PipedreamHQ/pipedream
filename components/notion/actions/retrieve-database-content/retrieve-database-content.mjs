import notion from "../../notion.app.mjs";

export default {
  key: "notion-retrieve-database-content",
  name: "Retrieve Database Content",
  description: "Get all content of a database. [See the documentation](https://developers.notion.com/reference/post-database-query)",
  version: "0.0.6",
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
    $.export("$summary", `Successfully retrieved ${results.length} object${results.length === 1
      ? ""
      : "s"} in database`);
    return results;
  },
};
