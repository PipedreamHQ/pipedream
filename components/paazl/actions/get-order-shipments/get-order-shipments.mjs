import app from "../../paazl.app.mjs";

export default {
  key: "paazl-get-order-shipments",
  name: "Get Order Shipment Details",
  description: "Retrieves an order's shipments details. [See the documentation](https://support.paazl.com/hc/en-us/articles/360008633973-REST-API-reference#/Shipments/getShipmentsUsingGET)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    orderReference: {
      propDefinition: [
        app,
        "reference",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      orderReference,
    } = this;

    const response = await app.getOrderShipments({
      $,
      orderReference,
    });

    $.export("$summary", "Successfully retrieved shipment details for order");
    return response;
  },
};
