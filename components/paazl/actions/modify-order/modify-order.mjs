import app from "../../paazl.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "paazl-modify-order",
  name: "Modify Order",
  description: "Modifies the information of an order with a specific reference in the Paazl database. The method overwrites the order. [See the documentation](https://support.paazl.com/hc/en-us/articles/360008633973-REST-API-reference#/Order/editOrderUsingPUT)",
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

    const response = await app.modifyOrder({
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

    $.export("$summary", `Successfully modified order information for reference: ${reference}`);
    return response || {
      success: true,
    };
  },
};
