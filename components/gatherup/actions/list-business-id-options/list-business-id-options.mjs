import gatherup from "../../gatherup.app.mjs";

export default {
  key: "gatherup-list-business-id-options",
  name: "List Business ID Options",
  description: "Retrieves available options for the Business ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    gatherup,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await gatherup.propDefinitions.businessId.options.call(this.gatherup, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
