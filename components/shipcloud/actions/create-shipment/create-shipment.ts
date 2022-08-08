import shipcloud from "../../app/shipcloud.app";
import { defineAction } from "@pipedream/types";
import { Shipment } from "../../common/responseSchemas";
import { CreateShipmentParams } from "../../common/requestParams";

export default defineAction({
  name: "Create Shipment",
  description:
    "Create a shipment [See docs here](https://developers.shipcloud.io/reference/#creating-a-shipment)",
  key: "shipcloud-create-shipment",
  version: "0.0.1",
  type: "action",
  props: {
    shipcloud,
    carrier: {
      type: "string",
      label: "Carrier",
      description: "The carrier you want to use",
      options: [
        "angel_de",
        "cargo_international",
        "dhl",
        "dhl_express",
        "dpag",
        "dpd",
        "gls",
        "go",
        "hermes",
        "iloxx",
        "parcel_one",
        "ups",
      ],
    },
    toAddress: {
      propDefinition: [shipcloud, "address"],
    },
    fromAddress: {
      propDefinition: [shipcloud, "address"],
      label: "Sender Address",
    },
    package: {
      type: "object",
      label: "Package",
      description:
        "Object describing the package [(more info on the Shipcloud Docs)](https://developers.shipcloud.io/reference/#creating-a-shipment)",
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
        carrier: this.toAddress,
        to: this.toAddress,
        from: this.fromAddress,
        package: this.package,
        ...this.additionalOptions,
      },
    };
    const data: Shipment = await this.shipcloud.createShipment(params);

    $.export("$summary", 'Created shipment successfully');

    return data;
  },
});
