import app from "../../paazl.app.mjs";

export default {
  key: "paazl-get-shipment-labels",
  name: "Get Specific Shipment Label",
  description: "Retrieves a specific shipment's labels. [See the documentation](https://support.paazl.com/hc/en-us/articles/360008633973-REST-API-reference#/Shipments/getShipmentLabelsUsingGet)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    type: {
      propDefinition: [
        app,
        "labelType",
      ],
      description: "Format of the labels",
    },
    size: {
      propDefinition: [
        app,
        "labelSize",
      ],
      description: "Size of the labels",
    },
  },
  async run({ $ }) {
    const {
      app,
      orderReference,
      shipmentId,
      type,
      size,
    } = this;

    const response = await app.getShipmentLabels({
      $,
      orderReference,
      shipmentId,
      params: {
        type,
        size,
      },
    });

    $.export("$summary", `Successfully retrieved labels for shipment: ${shipmentId} in order: ${orderReference}`);
    return response;
  },
};
