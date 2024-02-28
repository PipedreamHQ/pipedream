import keysender from "../../keysender.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "keysender-create-order",
  name: "Create Order",
  description: "Creates a new order dispatch within keysender. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    keysender,
    productId: {
      propDefinition: [
        keysender,
        "productId",
      ],
    },
    quantity: {
      propDefinition: [
        keysender,
        "quantity",
      ],
    },
    recipientInfo: {
      propDefinition: [
        keysender,
        "recipientInfo",
      ],
    },
    orderType: {
      propDefinition: [
        keysender,
        "orderType",
      ],
      optional: true,
    },
    priorityStatus: {
      propDefinition: [
        keysender,
        "priorityStatus",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const orderDetails = {
      product_id: this.productId,
      quantity: this.quantity,
      recipient_info: this.recipientInfo,
      order_type: this.orderType,
      priority_status: this.priorityStatus,
    };

    const response = await this.keysender.createOrder({
      data: orderDetails,
    });

    $.export("$summary", `Successfully created order with ID: ${response.id}`);
    return response;
  },
};
