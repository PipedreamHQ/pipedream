import ecwid from "../ecwid.app.mjs";

export default {
  name: "Ecwid Paid Orders",
  version: "0.0.1",
  key: "ecwid-paid-orders",
  description: "Search for new orders which are PAID and AWAITING_PROCESSING. Emits events for each order and" +
      " sets order fulfilment status to PROCESSING",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    history: {
      label: "Max Days Back",
      description: "Max number of days to get the orders from",
      type: "integer",
      default: 30,
    },
    setFulfilmentStatus: {
      label: "Set fulfilment status to PROCESSING (Preferred)",
      description: "Upon receiving the order, fulfilment status will be set to PROCESSING so that " +
          "the same order is not fetched again. If unchecked, it needs to be handled in the workflow",
      type: "boolean",
      default: true,
    },
    ecwid,
  },
  type: "source",
  methods: {},
  async run() {
    let results = await this.ecwid.getOrders(this.history);
    for (const order of results) {
      this.$emit(order, {
        id: order.id,
        summary: `Order ${order.id}`,
        ts: Date.now(),
      });
      if (this.setFulfilmentStatus) {
        let updateStatus = await this.ecwid.updateFulfilmentStatus(order.id);
        if (updateStatus.data.updateCount === 1)
          console.log("Updated Order Status of " + order.id + " to PROCESSING");
        else
          console.error("Error Updating Order Status of " + order.id + " to PROCESSING");
      }
    }
  },
};
