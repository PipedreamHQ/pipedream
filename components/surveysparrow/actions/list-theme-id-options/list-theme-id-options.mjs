import surveysparrow from "../../surveysparrow.app.mjs";

export default {
  key: "surveysparrow-list-theme-id-options",
  name: "List Theme Id Options",
  description: "Retrieves available options for the Theme Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surveysparrow,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await surveysparrow.propDefinitions.themeId.options.call(this.surveysparrow, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
