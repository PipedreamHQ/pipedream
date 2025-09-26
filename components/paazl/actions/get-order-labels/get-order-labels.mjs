import app from "../../paazl.app.mjs";

export default {
  key: "paazl-get-order-labels",
  name: "Get Order Shipping Labels",
  description: "Retrieves an order's labels. [See the documentation](https://support.paazl.com/hc/en-us/articles/360008633973-REST-API-reference#/Shipments/getOrderLabelsUsingGet)",
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
      type,
      size,
    } = this;

    const response = await app.getOrderLabels({
      $,
      orderReference,
      params: {
        type,
        size,
      },
    });

    $.export("$summary", `Successfully retrieved labels for order: ${orderReference}`);
    return response;
  },
};
