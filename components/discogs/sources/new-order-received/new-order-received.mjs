import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "discogs-new-order-received",
  name: "New Order Received",
  description: "Emit new event when there is an order with status 'New Order'. [See the documentation](https://www.discogs.com/developers#page:marketplace,header:marketplace-list-orders)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getStatus() {
      return "New Order";
    },
    getSummary(id) {
      return `New Order Received: ${id}`;
    },
  },
  sampleEmit,
};
