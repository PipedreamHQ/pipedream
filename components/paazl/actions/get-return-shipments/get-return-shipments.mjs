import app from "../../paazl.app.mjs";

export default {
  key: "paazl-get-return-shipments",
  name: "Get Return Shipment Details",
  description: "Retrieves an order's return shipments details. [See the documentation](https://support.paazl.com/hc/en-us/articles/360008633973-REST-API-reference#/Shipments/getReturnShipmentsUsingGET)",
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

    const response = await app.getReturnShipments({
      $,
      orderReference,
    });

    $.export("$summary", `Successfully retrieved return shipment details for order: ${orderReference}`);
    return response;
  },
};
