import app from "../../paazl.app.mjs";

export default {
  key: "paazl-get-parcel-label",
  name: "Get Specific Parcel Label",
  description: "Retrieves a specific parcel's label. [See the documentation](https://support.paazl.com/hc/en-us/articles/360008633973-REST-API-reference#/Shipments/getParcelLabelUsingGet)",
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
    parcelId: {
      propDefinition: [
        app,
        "parcelId",
      ],
    },
    type: {
      propDefinition: [
        app,
        "labelType",
      ],
      description: "Format of the label",
    },
    size: {
      propDefinition: [
        app,
        "labelSize",
      ],
      description: "Size of the label",
    },
  },
  async run({ $ }) {
    const {
      app,
      orderReference,
      shipmentId,
      parcelId,
      type,
      size,
    } = this;

    const response = await app.getParcelLabel({
      $,
      orderReference,
      shipmentId,
      parcelId,
      params: {
        type,
        size,
      },
    });

    $.export("$summary", `Successfully retrieved label for parcel: ${parcelId} in shipment: ${shipmentId} of order: ${orderReference}`);
    return response;
  },
};
