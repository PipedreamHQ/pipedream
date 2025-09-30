import app from "../../paazl.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "paazl-save-order",
  name: "Save Order",
  description: "Saves an order's most important information to the Paazl database once a customer has paid for their purchase. [See the documentation](https://support.paazl.com/hc/en-us/articles/360008633973-REST-API-reference#/Order/saveOrderUsingPOST)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    reference: {
      propDefinition: [
        app,
        "reference",
      ],
      label: "Order Reference",
      description: "Your own order reference for a purchase transaction. Must be unique within the webshop.",
    },
    consignee: {
      propDefinition: [
        app,
        "consignee",
      ],
    },
    customsValue: {
      propDefinition: [
        app,
        "customsValue",
      ],
    },
    insuredValue: {
      propDefinition: [
        app,
        "insuredValue",
      ],
    },
    codValue: {
      propDefinition: [
        app,
        "codValue",
      ],
    },
    description: {
      propDefinition: [
        app,
        "orderDescription",
      ],
    },
    requestedDeliveryDate: {
      propDefinition: [
        app,
        "requestedDeliveryDate",
      ],
    },
    products: {
      propDefinition: [
        app,
        "products",
      ],
    },
    invoiceNumber: {
      propDefinition: [
        app,
        "invoiceNumber",
      ],
    },
    invoiceDate: {
      propDefinition: [
        app,
        "invoiceDate",
      ],
    },
    returnProp: {
      propDefinition: [
        app,
        "returnProp",
      ],
    },
    sender: {
      propDefinition: [
        app,
        "sender",
      ],
    },
    shipping: {
      propDefinition: [
        app,
        "shipping",
      ],
    },
    weight: {
      propDefinition: [
        app,
        "orderWeight",
      ],
    },
    additionalInstruction: {
      propDefinition: [
        app,
        "additionalInstruction",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      reference,
      consignee,
      customsValue,
      insuredValue,
      codValue,
      description,
      requestedDeliveryDate,
      products,
      invoiceNumber,
      invoiceDate,
      returnProp,
      sender,
      shipping,
      weight,
      additionalInstruction,
    } = this;

    const response = await app.saveOrder({
      $,
      data: {
        reference,
        consignee: utils.parseJson(consignee),
        customsValue: utils.parseJson(customsValue),
        insuredValue: utils.parseJson(insuredValue),
        codValue: utils.parseJson(codValue),
        description,
        requestedDeliveryDate,
        products: utils.parseArray(products),
        invoiceNumber,
        invoiceDate,
        return: utils.parseJson(returnProp),
        sender: utils.parseJson(sender),
        shipping: utils.parseJson(shipping),
        weight: weight
          ? parseFloat(weight)
          : undefined,
        additionalInstruction,
      },
    });

    $.export("$summary", `Successfully saved order information for reference: ${reference}`);
    return response || {
      success: true,
    };
  },
};
