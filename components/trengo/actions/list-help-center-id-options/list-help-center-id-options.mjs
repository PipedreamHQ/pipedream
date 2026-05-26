import trengo from "../../trengo.app.mjs";

export default {
  key: "trengo-list-help-center-id-options",
  name: "List Help Center ID Options",
  description: "Retrieves available options for the Help Center ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    trengo,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await trengo.propDefinitions.helpCenterId.options.call(this.trengo, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
