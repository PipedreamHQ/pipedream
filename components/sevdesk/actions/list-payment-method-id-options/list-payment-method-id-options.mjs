import sevdesk from "../../sevdesk.app.mjs";

export default {
  key: "sevdesk-list-payment-method-id-options",
  name: "List Payment Method Id Options",
  description: "Retrieves available options for the Payment Method Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sevdesk,
  },
  async run({ $ }) {
    const options = await sevdesk.propDefinitions.paymentMethodId.options.call(this.sevdesk);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
