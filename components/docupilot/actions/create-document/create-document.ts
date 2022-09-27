import docupilot from "../../app/docupilot.app";
import { defineAction } from "@pipedream/types";
import { Shipment } from "../../common/responseSchemas";
import { CreateShipmentParams } from "../../common/requestParams";

export default defineAction({
  name: "Create Shipment",
  description:
    "Create a shipment [See docs here](https://developers.docupilot.io/reference/#creating-a-shipment)",
  key: "docupilot-create-document",
  version: "0.0.1",
  type: "action",
  props: {
    docupilot,
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description:
        "Optional parameters to pass, such as `description` or `notification_email` [(more info on the docupilot Docs)](https://developers.docupilot.io/reference/#creating-a-shipment)",
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
    const data: Shipment = await this.docupilot.createShipment(params);

    $.export("$summary", "Created shipment successfully");

    return data;
  },
});
