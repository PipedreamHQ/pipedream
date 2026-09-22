import relevance_ai from "../../relevance_ai.app.mjs";

export default {
  key: "relevance_ai-list-tool-id-options",
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
    relevance_ai,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await relevance_ai.propDefinitions.toolId.options.call(this.relevance_ai, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
