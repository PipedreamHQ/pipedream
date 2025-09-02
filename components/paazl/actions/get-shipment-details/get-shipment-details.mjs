import paazl from "../../paazl.app.mjs";

export default {
  key: "paazl-get-shipment-details",
  name: "Get Shipment Details",
  description: "Retrieve detailed information about a specific shipment from Paazl. [See the documentation](https://support.paazl.com/hc/en-us/articles/360008633973-REST-API-reference#/Shipments/getShipmentByShipmentIdUsingGET)",
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
    shipmentId: {
      propDefinition: [
        paazl,
        "shipmentId",
        ({ orderId }) => ({
          orderId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.paazl.getOrderShipmentDetails({
      $,
      orderId: this.orderId,
      shipmentId: this.shipmentId,
    });

    $.export("$summary", `Successfully retrieved shipment details for ${this.orderId}`);
    return response;
  },
};
