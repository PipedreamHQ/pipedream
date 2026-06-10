import helpspot from "../../helpspot.app.mjs";

export default {
  key: "helpspot-list-x-status-options",
  name: "List Status Options",
  description: "Retrieves available options for the Status field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    helpspot,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await helpspot.propDefinitions.xStatus.options.call(this.helpspot, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
