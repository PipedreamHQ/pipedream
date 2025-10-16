import shipstation from "../../shipstation.app.mjs";
import constants from "../common/constants.mjs";
import utils from "../common/utils.mjs";

export default {
  key: "shipstation-create-order",
  name: "Create Order",
  description: "Create a new order. [See docs here](https://www.shipstation.com/docs/api/orders/create-update-order)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shipstation,
    orderNumber: {
      label: "Order Number",
      description: "A user-defined order number used to identify an order.",
      type: "string",
    },
    orderDate: {
      label: "Order Date",
      description: "The date the order was placed. E.g. 2015-06-29T08:46:27.0000000",
      type: "string",
    },
    orderStatus: {
      label: "Order Status",
      description: "The order's status.",
      type: "string",
      options: constants.ORDER_STATUSES,
    },
    billTo: {
      label: "Bill To",
      description: "The recipients billing address. Use the [Address](https://www.shipstation.com/docs/api/models/address) model.",
      type: "string",
    },
    shipTo: {
      label: "Ship To",
      description: "The recipient's shipping address. Use the [Address](https://www.shipstation.com/docs/api/models/address) model.",
      type: "string",
    },
    customerUsername: {
      label: "Customer Username",
      description: "The customer's username. Note: This property needs to be defined in order to generate a customer profile",
      type: "string",
      optional: true,
    },
    customerEmail: {
      label: "Customer Email",
      description: "The customer's email address.",
      optional: true,
      propDefinition: [
        shipstation,
        "customerEmail",
      ],
    },
    items: {
      label: "Items",
      description: "An array of item objects. Use an array of [OrderItem](https://www.shipstation.com/docs/api/models/order-item) models.",
      type: "string[]",
      optional: true,
    },
    gift: {
      label: "Gift",
      description: "Specifies whether or not this Order is a gift",
      type: "boolean",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      orderNumber,
      orderDate,
      orderStatus,
      billTo,
      shipTo,
      customerUsername,
      customerEmail,
      items,
      gift,
    } = this;

    const parsedItems = typeof items !== "string" && items?.length
      ? items.map((item) => utils.parseStringToJSON(item))
      : utils.parseStringToJSON(items, []);

    const response = await this.shipstation.createOrder({
      data: {
        orderNumber,
        orderDate,
        orderStatus,
        billTo: utils.parseStringToJSON(billTo),
        shipTo: utils.parseStringToJSON(shipTo),
        customerUsername,
        customerEmail,
        items: parsedItems,
        gift,
      },
      $,
    });

    $.export("$summary", "Successfully created order.");

    return response;
  },
};
