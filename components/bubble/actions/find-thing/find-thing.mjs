import bubble from "../../bubble.app.mjs";

export default {
  key: "bubble-find-thing",
  name: "Find Thing",
  description: "Searches for a thing in the Bubble database. [See the documentation](https://manual.bubble.io/core-resources/api/the-bubble-api/the-data-api/data-api-requests)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    bubble,
    searchQuery: {
      type: "string",
      label: "Search Query",
      description: "The query to search for a thing in the Bubble database",
    },
    searchParameters: {
      type: "object",
      label: "Search Parameters",
      description: "Optional parameters to refine the search results",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bubble.searchForThings({
      searchQuery: this.searchQuery,
      searchParameters: this.searchParameters,
    });

    $.export("$summary", `Successfully searched for things with query "${this.searchQuery}"`);
    return response;
  },
};
