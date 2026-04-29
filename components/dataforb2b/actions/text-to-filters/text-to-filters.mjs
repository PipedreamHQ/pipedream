import dataforb2b from "../../dataforb2b.app.mjs";

export default {
  key: "dataforb2b-text-to-filters",
  name: "Text to Filters",
  description: "Convert a natural language description into a structured filter object that can be used with **Search People** or **Search Company**. [See the documentation](https://docs.dataforb2b.ai/api-reference/text-to-filters)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    dataforb2b,
    query: {
      propDefinition: [
        dataforb2b,
        "query",
      ],
    },
    category: {
      propDefinition: [
        dataforb2b,
        "category",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dataforb2b.textToFilters({
      $,
      data: {
        query: this.query,
        category: this.category,
      },
    });

    $.export("$summary", `Successfully converted query to filters for category: ${this.category}`);
    return response;
  },
};
