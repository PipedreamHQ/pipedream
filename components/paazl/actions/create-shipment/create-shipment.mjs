import { parseObject } from "../../common/utils.mjs";
import paazl from "../../paazl.app.mjs";

export default {
  key: "paazl-create-shipment",
  name: "Create Shipment",
  description: "Create a new shipment in Paazl. [See the documentation](https://support.paazl.com/hc/en-us/articles/360008633973-REST-API-reference#/Shipments/createShipmentUsingPOST)",
  version: "0.0.1",
  type: "action",
  props: {
    paazl,
    orderId: {
      propDefinition: [
        paazl,
        "orderId",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "Format of the generated label(s).",
      options: [
        "PNG",
        "PDF",
        "ZPL",
      ],
      optional: true,
    },
    size: {
      type: "string",
      label: "Size",
      description: "Size of the generated label(s).",
      options: [
        "10x15",
        "10x21",
        "a4",
        "laser",
      ],
      optional: true,
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: " If quantity == 1 -> one extra label is generated. The default quantity value == 1. If quantity > 1 , extra labels are generated. It replaces packageCount in the POST order, if set. Extra labels are generated under 1 new shipment for each label. Mutually exclusive with `parcels`.",
      optional: true,
    },
    parcels: {
      type: "string[]",
      label: "Parcels",
      description: "Array of one or more parcels in the requested shipment. Mutually exclusive with `quantity`. E.g. **[{ \"name\": \"parcels\", \"attribute\": false, \"wrapped\": true }]**. [See the documentation](https://support.paazl.com/hc/en-us/articles/360008633973-REST-API-reference#/Shipments/createShipmentUsingPOST) for more information.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.paazl.createShipment({
      $,
      orderId: this.orderId,
      data: {
        type: this.type,
        size: this.size,
        quantity: this.quantity,
        parcels: parseObject(this.parcels),
      },
    });

    $.export("$summary", "Created shipment successfully");
    return response;
  },
};
