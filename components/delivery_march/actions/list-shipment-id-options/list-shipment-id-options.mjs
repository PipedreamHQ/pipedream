import delivery_march from "../../delivery_march.app.mjs";

export default {
  key: "delivery_march-list-shipment-id-options",
  name: "List Shipment ID Options",
  description: "Retrieves available options for the Shipment ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    delivery_march,
  },
  async run({ $ }) {
    const options = await delivery_march.propDefinitions.shipmentId.options
      .call(this.delivery_march);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
