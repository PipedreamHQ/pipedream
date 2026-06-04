import predictleads from "../../predictleads.app.mjs";

export default {
  key: "predictleads-list-technology-id-options",
  name: "List Technology Options",
  description: "Retrieves available options for the Technology field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    predictleads,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await predictleads.propDefinitions.technologyId.options
      .call(this.predictleads, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
