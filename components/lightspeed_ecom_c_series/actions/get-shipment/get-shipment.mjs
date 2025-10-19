import app from "../../lightspeed_ecom_c_series.app.mjs";

export default {
  key: "lightspeed_ecom_c_series-get-shipment",
  name: "Get Shipment",
  description: "Get a shipment by ID. [See the documentation](https://developers.lightspeedhq.com/ecom/endpoints/shipment/#get-retrieve-a-shipment)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    shipmentId: {
      propDefinition: [
        app,
        "shipmentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getShipment({
      $,
      shipmentId: this.shipmentId,
    });

    $.export("$summary", `Successfully fetched shipment ${this.shipmentId}`);
    return response;
  },
};
