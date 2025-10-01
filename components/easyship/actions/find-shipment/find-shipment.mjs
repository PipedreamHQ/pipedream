import easyship from "../../easyship.app.mjs";

export default {
  key: "easyship-find-shipment",
  name: "Find Shipment",
  description: "Find a shipment by ID. [See the documentation](https://developers.easyship.com/reference/shipments_index)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    easyship,
    shipmentId: {
      propDefinition: [
        easyship,
        "shipmentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.easyship.getShipment({
      $,
      shipmentId: this.shipmentId,
    });
    $.export("$summary", `Found shipment with ID: ${this.shipmentId}`);
    return response;
  },
};
