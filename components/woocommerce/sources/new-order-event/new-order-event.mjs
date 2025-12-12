import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "woocommerce-new-order-event",
  name: "New Order Event (Instant)",
  description: "Emit new event each time the specified order event(s) occur",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getSampleEvents({ perPage }) {
      return this.woocommerce.listOrders({
        per_page: perPage,
        orderby: "date",
      });
    },
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
  sampleEmit,
};
