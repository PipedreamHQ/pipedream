import planview_leankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-list-planning-series-id-options",
  name: "List Planning Series ID Options",
  description: "Retrieves available options for the Planning Series ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    planview_leankit,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await planview_leankit.propDefinitions.planningSeriesId.options
      .call(this.planview_leankit, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
