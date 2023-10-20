import shipcloud from "../../app/shipcloud.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Get Shipment Info",
  description:
    "Retrieve details for a shipment [See docs here](https://developers.shipcloud.io/reference/#getting-information-about-a-shipment)",
  key: "shipcloud-get-shipment-info",
  version: "0.0.1",
  type: "action",
  props: {
    shipcloud,
    shipmentId: {
      propDefinition: [
        shipcloud,
        "shipmentId",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      $,
      id: this.shipmentId,
    };
    const data = await this.shipcloud.getShipment(params);

    $.export(
      "$summary",
      "Retrieved shipment info successfully",
    );

    return data;
  },
});
