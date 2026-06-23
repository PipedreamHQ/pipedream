import upkeep from "../../upkeep.app.mjs";

export default {
  key: "upkeep-list-purchase-order-id-options",
  name: "List Purchase Order Id Options",
  description: "Retrieves available options for the Purchase Order Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    upkeep,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await upkeep.propDefinitions.purchaseOrderId.options.call(this.upkeep, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
