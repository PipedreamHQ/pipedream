import strale from "../../strale.app.mjs";

export default {
  name: "Search Capabilities",
  version: "0.0.2",
  key: "strale-search-capabilities",
  description: "Search Strale's catalog of pay-per-call tools using natural language. Returns matching capabilities with their price per call. [See the documentation](https://strale.dev/docs)",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
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
        query: this.task,
        limit: this.limit ?? 5,
      },
    });

    $.export("$summary", `Successfully searched for matching capabilities for "${this.task}"`);

    return response;
  },
};
