import picqer from "../../picqer.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "picqer-get-shipment-data",
  name: "Get Shipment Data",
  description: "Retrieve the data of a shipment in Picqer. [See the documentation](https://picqer.com/en/api/picklist-shipments)",
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
    const response = await this.picqer.getShipmentData({
      shipmentId: this.shipmentId,
    });
    $.export("$summary", `Successfully retrieved shipment data for shipment ID: ${this.shipmentId}`);
    return response;
  },
};
