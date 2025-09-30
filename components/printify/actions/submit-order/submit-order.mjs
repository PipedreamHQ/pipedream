import { SHIPPING_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import printify from "../../printify.app.mjs";

export default {
  key: "printify-submit-order",
  name: "Submit Order",
  description: "Places an order of an existing product on Printify. [See the documentation](https://developers.printify.com/#submit-an-order)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    printify,
    shopId: {
      propDefinition: [
        printify,
        "shopId",
      ],
    },
    lineItems: {
      type: "string[]",
      label: "Line Items",
      description: "A list of item objects. [See the documentation](https://developers.printify.com/#submit-an-order)",
    },
    shippingMethod: {
      type: "integer",
      label: "Shipping Method",
      description: "Method of shipping selected for the order.",
      options: SHIPPING_OPTIONS,
    },
    isPrintifyExpress: {
      type: "boolean",
      label: "Is Printify Express",
      description: "Boolean value that indicates if the order is using [Printify Express](https://help.printify.com/hc/en-us/sections/9116968124689-Printify-Express-Delivery) shipping.",
      optional: true,
    },
    sendShippingNotification: {
      type: "boolean",
      label: "Send Shipping Notification",
      description: "Indicates whether the recipient will be notified or not.",
      optional: true,
    },
    addressTo: {
      type: "object",
      label: "Address To",
      description: "The recipient address object.",
    },
  },
  async run({ $ }) {
    const response = await this.printify.submitOrder({
      shopId: this.shopId,
      data: {
        line_items: parseObject(this.lineItems),
        shipping_method: this.shippingMethod,
        is_printify_express: this.isPrintifyExpress,
        address_to: parseObject(this.addressTo),
        send_shipping_notification: this.sendShippingNotification,
      },
    });

    $.export("$summary", `Successfully submited order with ID: ${response.id}`);
    return response;
  },
};
