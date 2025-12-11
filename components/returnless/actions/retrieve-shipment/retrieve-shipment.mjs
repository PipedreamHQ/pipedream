import app from "../../returnless.app.mjs";

export default {
  key: "returnless-retrieve-shipment",
  name: "Retrieve Shipment",
  description: "Retrieve a shipment. [See the documentation](https://docs.returnless.com/docs/api-rest-reference/8add0ab769032-retrieve-a-shipment)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
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
    const { data } = await this.app.getShipment({
      $,
      shipmentId: this.shipmentId,
    });

    $.export("$summary", `Successfully retrieved shipment ${this.shipmentId}`);
    return data;
  },
};
