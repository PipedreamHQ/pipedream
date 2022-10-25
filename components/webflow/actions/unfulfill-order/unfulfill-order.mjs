import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-unfulfill-order",
  name: "Unfulfill Order",
  description: "Unfulfill an order. [See the docs here](https://developers.webflow.com/#unfulfill-order)",
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
  },
  async run({ $ }) {
    const apiClient = this.webflow._createApiClient();

    const response = apiClient.post(`/sites/${this.siteId}/order/${this.orderId}/unfulfill`);

    $.export("$summary", "Successfully unfulfilled order");

    return response;
  },
};
