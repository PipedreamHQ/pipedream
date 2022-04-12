import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-unfulfill-order",
  name: "Unfulfill Order",
  description: "Unfulfill a order. [See the docs here](https://developers.webflow.com/#unfulfill-order)",
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
  async run() {
    const apiClient = this.webflow._createApiClient();

    return apiClient.post(`/sites/${this.siteId}/order/${this.orderId}/unfulfill`);
  },
};
