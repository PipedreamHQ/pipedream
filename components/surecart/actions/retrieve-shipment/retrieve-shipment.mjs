import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-retrieve-shipment",
  name: "Retrieve Shipment",
  description: "Retrieve a shipment by ID. [See the documentation](https://developer.surecart.com/api-reference/shipments/retrieve)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    shipmentId: {
      propDefinition: [
        surecart,
        "shipmentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surecart.getShipment({
      $,
      shipmentId: this.shipmentId,
    });
    $.export("$summary", `Successfully retrieved shipment ${this.shipmentId}`);
    return response;
  },
};
