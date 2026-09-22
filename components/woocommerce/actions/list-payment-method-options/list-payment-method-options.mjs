import woocommerce from "../../woocommerce.app.mjs";

export default {
  key: "woocommerce-list-payment-method-options",
  name: "List Payment Method Options",
  description: "Retrieves available options for the Payment Method field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    woocommerce,
  },
  async run({ $ }) {
    const options = await woocommerce.propDefinitions.paymentMethod.options.call(this.woocommerce);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
