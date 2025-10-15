import shipcloud from "../../app/shipcloud.app";
import { defineAction } from "@pipedream/types";
import { Shipment } from "../../common/responseSchemas";
import { GetShipmentParams } from "../../common/requestParams";

export default defineAction({
  name: "Get Shipment Info",
  description:
    "Retrieve details for a shipment [See docs here](https://developers.shipcloud.io/reference/#getting-information-about-a-shipment)",
  key: "shipcloud-get-shipment-info",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
  async run({ $ }): Promise<Shipment> {
    const params: GetShipmentParams = {
      $,
      id: this.shipmentId,
    };
    const data: Shipment = await this.shipcloud.getShipment(params);

    $.export(
      "$summary",
      "Retrieved shipment info successfully",
    );

    return data;
  },
});
