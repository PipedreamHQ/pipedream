import insighto_ai from "../../insighto_ai.app.mjs";

export default {
  key: "insighto_ai-list-widget-id-options",
  name: "List Widget ID Options",
  description: "Retrieves available options for the Widget ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    insighto_ai,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await insighto_ai.propDefinitions.widgetId.options.call(this.insighto_ai, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
