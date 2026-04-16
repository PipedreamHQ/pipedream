import bolCom from "../../bol_com.app.mjs";

export default {
  key: "bol_com-get-shipment",
  name: "Get Shipment",
  description: "Get a shipment. [See the documentation](https://api.bol.com/retailer/public/redoc/v10/retailer.html#tag/Shipments/operation/get-shipment)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bolCom,
    shipmentId: {
      propDefinition: [
        bolCom,
        "shipmentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bolCom.getShipment({
      $,
      shipmentId: this.shipmentId,
    });
    $.export("$summary", `Successfully retrieved shipment: ${response.shipmentId}`);
    return response;
  },
};
