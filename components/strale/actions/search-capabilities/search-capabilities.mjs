import strale from "../../strale.app.mjs";

export default {
  name: "Search Capabilities",
  version: "0.1.0",
  key: "strale-search-capabilities",
  description: "Search Strale's catalog of 290+ data capabilities using natural language. Returns matching capabilities with prices and quality scores. [See the documentation](https://strale.dev)",
  type: "action",
  props: {
    strale,
    task: {
      propDefinition: [
        strale,
        "task",
      ],
    },
    limit: {
      propDefinition: [
        strale,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.strale.suggest({
      $,
      data: {
        task: this.task,
        limit: this.limit ?? 5,
      },
    });

    const count = response.suggestions?.length ?? 0;
    $.export("$summary", `Found ${count} matching capabilit${count === 1
      ? "y"
      : "ies"} for "${this.task}"`);

    return response;
  },
};
