import picqer from "../../picqer.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "picqer-get-shipment-status",
  name: "Get Shipment Status",
  description: "Get the status of a shipment in Picqer. [See the documentation](https://picqer.com/en/api/picklist-shipments#h-get-single-shipment)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    picqer,
    shipmentId: {
      propDefinition: [
        picqer,
        "shipmentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.picqer.getShipmentStatus({
      shipmentId: this.shipmentId,
    });
    $.export("$summary", `Successfully retrieved status for shipment ID: ${this.shipmentId}`);
    return response;
  },
};
