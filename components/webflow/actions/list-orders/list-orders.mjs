import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-list-orders",
  name: "List Orders",
  description: "List orders",
  version: "0.1.1648564084",
  type: "action",
  props: {
    webflow,
    siteId: {
      propDefinition: [
        webflow,
        "sites",
      ],
    },
    status: {
      label: "Status",
      description: "The status to filter the orders.",
      type: "string",
      options: [
        "pending",
        "refunded",
        "dispute-lost",
        "fulfilled",
        "disputed",
        "unfulfilled",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    return this.webflow.getOrders({
      $,
      siteId: this.siteId,
      status: this.status,
    });
  },
};
