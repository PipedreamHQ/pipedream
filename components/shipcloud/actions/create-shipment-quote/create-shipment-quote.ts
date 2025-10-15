import shipcloud from "../../app/shipcloud.app";
import { defineAction } from "@pipedream/types";
import { ShipmentQuote } from "../../common/responseSchemas";
import { CreateShipmentQuoteParams } from "../../common/requestParams";

export default defineAction({
  name: "Create Shipment Quote",
  description:
    "Create a shipment quote [See docs here](https://developers.shipcloud.io/reference/#creating-a-shipment-quote)",
  key: "shipcloud-create-shipment-quote",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shipcloud,
    carrier: {
      propDefinition: [
        shipcloud,
        "carrier",
      ],
    },
    service: {
      propDefinition: [
        shipcloud,
        "service",
      ],
    },
    toAddress: {
      propDefinition: [
        shipcloud,
        "address",
      ],
    },
    fromAddress: {
      propDefinition: [
        shipcloud,
        "address",
      ],
      label: "Sender Address",
    },
    package: {
      propDefinition: [
        shipcloud,
        "package",
      ],
    },
  },
  async run({ $ }): Promise<ShipmentQuote> {
    const params: CreateShipmentQuoteParams = {
      $,
      data: {
        carrier: this.carrier,
        service: this.service,
        to: JSON.parse(this.toAddress),
        from: JSON.parse(this.fromAddress),
        package: this.package,
      },
    };
    const data: ShipmentQuote = await this.shipcloud.createShipmentQuote(params);

    $.export("$summary", "Created shipment quote successfully");

    return data;
  },
});
