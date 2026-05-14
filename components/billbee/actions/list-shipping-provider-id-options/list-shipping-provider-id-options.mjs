import billbee from "../../billbee.app.mjs";

export default {
  key: "billbee-list-shipping-provider-id-options",
  name: "List Shipping Provider ID Options",
  description: "Retrieves available options for the Shipping Provider ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    billbee,
  },
  async run({ $ }) {
    const options = await billbee.propDefinitions.shippingProviderId.options
      .call(this.billbee);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
