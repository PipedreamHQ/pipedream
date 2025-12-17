import app from "../../returnless.app.mjs";

export default {
  key: "returnless-list-statuses-of-shipment",
  name: "List Statuses of Shipment",
  description: "List all statuses of a shipment. [See the documentation](https://docs.returnless.com/docs/api-rest-reference/e274dab430bb7-list-all-statuses-of-a-shipment)",
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
    const { data } = await this.app.listShipmentStatuses({
      $,
      shipmentId: this.shipmentId,
    });

    $.export("$summary", `Successfully retrieved ${data.length} status(es) for shipment ${this.shipmentId}`);
    return data;
  },
};
