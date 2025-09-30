import app from "../../paazl.app.mjs";

export default {
  key: "paazl-get-shipment-tracking",
  name: "Get Specific Shipment Tracking",
  description: "Retrieves a specific shipment's tracking number details. [See the documentation](https://support.paazl.com/hc/en-us/articles/360008633973-REST-API-reference#/Shipments/getShipmentByShipmentIdUsingGET)",
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
    shipmentId: {
      propDefinition: [
        app,
        "shipmentId",
        ({ orderReference }) => ({
          orderReference,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      orderReference,
      shipmentId,
    } = this;

    const response = await app.getShipmentById({
      $,
      orderReference,
      shipmentId,
    });

    $.export("$summary", `Successfully retrieved tracking details for shipment: ${shipmentId} in order: ${orderReference}`);
    return response;
  },
};
