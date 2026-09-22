import recreation_gov from "../../recreation_gov.app.mjs";

export default {
  key: "recreation_gov-list-campsite-id-options",
  name: "List Campsite Id Options",
  description: "Retrieves available options for the Campsite Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    recreation_gov,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await recreation_gov.propDefinitions.campsiteId.options
      .call(this.recreation_gov, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
