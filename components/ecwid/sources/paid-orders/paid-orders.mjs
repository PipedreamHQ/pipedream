import ecwid from "../../ecwid.app.mjs";
import { FULFILMENT_STATUS_LIST } from "../../commons/commons.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Ecwid Paid Orders",
  version: "0.0.4",
  key: "ecwid-paid-orders",
  description: "Search for new orders which are PAID and AWAITING_PROCESSING. Emits events for each order and" +
    " sets order fulfilment status to PROCESSING",
  props: {
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    history: {
      label: "Max Days Back",
      description: "Max number of days to get the orders from",
      type: "integer",
      default: 30,
    },
    setFulfilmentStatus: {
      label: "Set order fulfilment status (Preferred)",
      description: "Upon receiving the order, fulfilment status will be set to user defined value so that " +
        "the same order is not fetched again. If unchecked, it needs to be handled in the workflow",
      type: "boolean",
      default: true,
    },
    newFulfilmentStatus: {
      label: "New Fulfilment Status",
      description: "New Fulfilment Status to be updated in the order",
      type: "string",
      options: FULFILMENT_STATUS_LIST,
      default: "PROCESSING",
    },
    ecwid,
  },
  type: "source",
  methods: {},
  async run() {
    let ordersResponse = await this.ecwid.getOrders(this.history);
    for (const order of ordersResponse.items) {
      this.$emit(order, {
        id: order.id,
        summary: `Order ${order.id}`,
        ts: Date.now(),
      });
      if (this.setFulfilmentStatus) {
        let updateStatus = await this.ecwid.updateFulfilmentStatus(
          order.id,
          this.newFulfilmentStatus,
        );
        if (updateStatus.updateCount === 1)
          console.log("Updated Order Status of " + order.id +
            " to " + this.newFulfilmentStatus);
        else
          console.error("Error Updating Order Status of "
            + order.id + " to " + this.newFulfilmentStatus);
      }
    }
  },
};
