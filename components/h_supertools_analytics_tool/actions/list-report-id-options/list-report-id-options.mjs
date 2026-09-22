import h_supertools_analytics_tool from "../../h_supertools_analytics_tool.app.mjs";

export default {
  key: "h_supertools_analytics_tool-list-report-id-options",
  name: "List Report Id Options",
  description: "Retrieves available options for the Report Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    h_supertools_analytics_tool,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await h_supertools_analytics_tool.propDefinitions.reportId.options
      .call(this.h_supertools_analytics_tool, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
