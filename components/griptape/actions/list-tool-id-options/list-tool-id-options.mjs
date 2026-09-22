import griptape from "../../griptape.app.mjs";

export default {
  key: "griptape-list-tool-id-options",
  name: "List Tool ID Options",
  description: "Retrieves available options for the Tool ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    griptape,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await griptape.propDefinitions.toolId.options.call(this.griptape, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
