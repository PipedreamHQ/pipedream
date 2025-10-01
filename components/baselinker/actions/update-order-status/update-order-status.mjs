import app from "../../baselinker.app.mjs";
import method from "../../common/method.mjs";

export default {
  key: "baselinker-update-order-status",
  name: "Update Order Status",
  description: "It allows you to change order status. [See the Documentation](https://api.baselinker.com/index.php?method=setOrderStatus).",
  type: "action",
  version: "0.0.2",
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
    statusId: {
      propDefinition: [
        app,
        "orderStatusId",
      ],
    },
  },
  methods: {
    updateOrderStatus(args = {}) {
      return this.app.connector({
        ...args,
        data: {
          method: method.SET_ORDER_STATUS,
          ...args.data,
        },
      });
    },
  },
  async run({ $: step }) {
    const {
      orderId,
      statusId,
    } = this;

    const response = await this.updateOrderStatus({
      step,
      data: {
        parameters: {
          order_id: orderId,
          status_id: statusId,
        },
      },
    });

    step.export("$summary", `Successfully updated order ${orderId} status to ${statusId}.`);

    return response;
  },
};
