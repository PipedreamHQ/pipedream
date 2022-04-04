import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-fulfill-order",
  name: "Fulfill Order",
  description: "Fulfill a order",
  version: "0.0.1",
  type: "action",
  props: {
    webflow,
    siteId: {
      propDefinition: [
        webflow,
        "sites",
      ],
    },
    orderId: {
      propDefinition: [
        webflow,
        "orders",
      ],
    },
    sendOrderFulfilledEmail: {
      label: "Send Order Fulfilled Email",
      description: "Whether or not the Order Fulfilled email should be sent",
      type: "boolean",
      default: false,
    },
  },
  async run({ $ }) {
    return this.webflow._makeRequest(`/sites/${this.siteId}/order/${this.orderId}/fulfill`, {
      $,
      config: {
        method: "post",
        data: {
          sendOrderFulfilledEmail: this.sendOrderFulfilledEmail,
        },
      },
    });
  },
};
