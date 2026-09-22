import zenfulfillment from "../../zenfulfillment.app.mjs";

export default {
  key: "zenfulfillment-list-fulfillment-id-options",
  name: "List Fulfillment ID Options",
  description: "Retrieves available options for the Fulfillment ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zenfulfillment,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await zenfulfillment.propDefinitions.fulfillmentId.options
      .call(this.zenfulfillment, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
