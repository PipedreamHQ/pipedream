import unleashed_software from "../../unleashed_software.app.mjs";

export default {
  key: "unleashed_software-list-purchase-order-id-options",
  name: "List Purchase Order ID Options",
  description: "Retrieves available options for the Purchase Order ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    unleashed_software,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await unleashed_software.propDefinitions.purchaseOrderId.options
      .call(this.unleashed_software, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
