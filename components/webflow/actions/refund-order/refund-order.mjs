import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-refund-order",
  name: "Refund Order",
  description: "Refund an order. [See the docs here](https://developers.webflow.com/#refund-order)",
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
  },
  async run({ $ }) {
    const apiClient = this.webflow._createApiClient();

    const response = apiClient.get(`/sites/${this.siteId}/order/${this.orderId}/refund`);

    $.export("$summary", "Successfully refunded order");

    return response;
  },
};
