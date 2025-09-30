import app from "../../more_trees_.app.mjs";

export default {
  name: "Get Carbon Offset",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "more_trees_-get-carbon-offset",
  description: "Get the total carbon offset. [See the documentation](https://moretrees.eco/user-guide/api/#KB30)",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getCarbonOffset({
      $,
    });

    if (response) {
      $.export("$summary", "Successfully retrieved carbon offset");
    }

    return response;
  },
};
