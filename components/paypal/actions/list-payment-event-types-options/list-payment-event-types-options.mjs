import paypal from "../../paypal.app.mjs";

export default {
  key: "paypal-list-payment-event-types-options",
  name: "List Payment Event Types Options",
  description: "Retrieves available options for the Payment Event Types field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    paypal,
  },
  async run({ $ }) {
    const options = await paypal.propDefinitions.paymentEventTypes.options.call(this.paypal);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
