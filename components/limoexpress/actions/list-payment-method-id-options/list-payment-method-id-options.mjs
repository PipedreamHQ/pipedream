import limoexpress from "../../limoexpress.app.mjs";

export default {
  key: "limoexpress-list-payment-method-id-options",
  name: "List Payment Method ID Options",
  description: "Retrieves available options for the Payment Method ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    limoexpress,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await limoexpress.propDefinitions.paymentMethodId.options
      .call(this.limoexpress, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
