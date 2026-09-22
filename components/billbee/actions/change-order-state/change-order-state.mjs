import app from "../../billbee.app.mjs";

export default {
  key: "billbee-change-order-state",
  name: "Change Order State",
  description: "Change the state of an order. [See the documentation](https://app.billbee.io//swagger/ui/index#/Orders/OrderApi_UpdateState)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    orderId: {
      propDefinition: [
        app,
        "orderId",
      ],
    },
    newStateId: {
      type: "string",
      label: "New Order State",
      description: "The new state for the order",
      optional: false,
      propDefinition: [
        app,
        "orderStateId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      orderId,
      newStateId,
    } = this;

    await app.changeOrderState({
      $,
      orderId,
      data: {
        NewStateId: parseInt(newStateId),
      },
    });

    $.export("$summary", "Successfully changed order state");

    return {
      success: true,
    };
  },
};
