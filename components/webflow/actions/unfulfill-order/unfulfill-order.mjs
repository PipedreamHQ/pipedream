import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-unfulfill-order",
  name: "Unfulfill Order",
  description: "Unfulfill a order",
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
    return this.webflow._makeRequest(`/sites/${this.siteId}/order/${this.orderId}/unfulfill`, {
      $,
      config: {
        method: "post",
      },
    });
  },
};
