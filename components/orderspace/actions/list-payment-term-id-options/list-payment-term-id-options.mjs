import orderspace from "../../orderspace.app.mjs";

export default {
  key: "orderspace-list-payment-term-id-options",
  name: "List Payment Term ID Options",
  description: "Retrieves available options for the Payment Term ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    orderspace,
  },
  async run({ $ }) {
    const options = await orderspace.propDefinitions.paymentTermId.options.call(this.orderspace);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
