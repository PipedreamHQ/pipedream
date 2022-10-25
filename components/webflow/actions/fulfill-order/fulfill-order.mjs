import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-fulfill-order",
  name: "Fulfill Order",
  description: "Fulfill an order. [See the docs here](https://developers.webflow.com/#fulfill-order)",
  version: "0.0.2",
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
    const apiClient = this.webflow._createApiClient();

    const response = await apiClient.post(`/sites/${this.siteId}/order/${this.orderId}/fulfill`, {
      data: {
        sendOrderFulfilledEmail: this.sendOrderFulfilledEmail,
      },
    });

    $.export("$summary", "Successfully fulfilled order");

    return response;
  },
};
