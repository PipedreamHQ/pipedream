import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-search-issues",
  name: "Search issues",
  description: "Search issues. See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#creating-and-editing-issues)",
  type: "action",
  version: "0.0.1",
  props: {
    query: {
      propDefinition: [
        linearApp,
        "query",
      ],
    },
    orderBy: {
      propDefinition: [
        linearApp,
        "orderBy",
      ],
    },
  },
  async run({ $ }) {
    const { query } = this;

    const response =
      await this.linearApp.searchIssues({
        query,
      });

    $.export("summary", `Found ${response.length} issues`);

    return response;
  },
};
