import ups from "../../ups.app.mjs";

export default {
  key: "ups-void-shipment",
  name: "Void Shipment",
  description: "Void a shipment. [See the documentation](https://developer.ups.com/tag/Shipping?loc=en_US#operation/VoidShipment)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ups,
    trackingNumber: {
      propDefinition: [
        ups,
        "trackingNumber",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ups.voidShipment({
      $,
      trackingNumber: this.trackingNumber,
    });

    $.export("$summary", `Successfully voided shipment with tracking number ${this.trackingNumber}`);
    return response;
  },
};
