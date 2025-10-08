import shipcloud from "../../app/shipcloud.app";
import { defineAction } from "@pipedream/types";
import { Shipment } from "../../common/responseSchemas";
import { CreateShipmentParams } from "../../common/requestParams";

export default defineAction({
  name: "Create Shipment",
  description:
    "Create a shipment [See docs here](https://developers.shipcloud.io/reference/#creating-a-shipment)",
  key: "shipcloud-create-shipment",
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
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description:
        "Optional parameters to pass, such as `description` or `notification_email` [(more info on the Shipcloud Docs)](https://developers.shipcloud.io/reference/#creating-a-shipment)",
      optional: true,
    },
  },
  async run({ $ }): Promise<Shipment> {
    const params: CreateShipmentParams = {
      $,
      data: {
        carrier: this.carrier,
        service: this.service,
        to: JSON.parse(this.toAddress),
        from: JSON.parse(this.fromAddress),
        package: this.package,
        additionalOptions: this.additionalOptions,
      },
    };
    const data: Shipment = await this.shipcloud.createShipment(params);

    $.export("$summary", "Created shipment successfully");

    return data;
  },
});
