import teamleader_focus from "../../teamleader_focus.app.mjs";

export default {
  key: "teamleader_focus-list-deal-source-options",
  name: "List Source Options",
  description: "Retrieves available options for the Source field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    teamleader_focus,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await teamleader_focus.propDefinitions.dealSource.options
      .call(this.teamleader_focus, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
