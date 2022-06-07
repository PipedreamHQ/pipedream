import common from "../common/base.mjs";

export default {
  ...common,
  key: "woocommerce-new-order-event",
  name: "New Order Event",
  description: "Emit new event each time the specified order event(s) occur",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic(topicType) {
      return `order.${topicType}`;
    },
    generateMeta(eventType, {
      id, date_modified: dateModified,
    }) {
      const ts = Date.parse(dateModified);
      return {
        id: `${id}${ts}`,
        summary: `Order ID: ${id} ${eventType}`,
        ts,
      };
    },
  },
};
