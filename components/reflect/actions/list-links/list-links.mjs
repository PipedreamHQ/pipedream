import reflect from "../../reflect.app.mjs";

export default {
  key: "reflect-list-links",
  name: "List Links",
  description: "Retieve all links for a graph. [See the documentation](https://openpm.ai/apis/reflect#/graphs/{graphId}/links)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    reflect,
    graphId: {
      propDefinition: [
        reflect,
        "graphId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.reflect.listLinks({
      graphId: this.graphId,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved ${response.length} link${response.length === 1
        ? "s"
        : ""}.`);
    }

    return response;
  },
};
