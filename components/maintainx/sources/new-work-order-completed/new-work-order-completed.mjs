import maintainx from "../../maintainx.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Work Order Completed",
  version: "0.0.1",
  key: "maintainx-new-work-order-completed",
  description: "Emit new event each time a new work order is completed.",
  type: "source",
  dedupe: "unique",
  props: {
    maintainx,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    emitEvent(data) {
      if (!data.completedAt) {
        return;
      }

      this._setLastWorkOrderId(data.id);

      this.$emit(data, {
        id: data.id,
        summary: `New work order with ID ${data.id}`,
        ts: Date.parse(data.createdAt),
      });
    },
    _setLastWorkOrderId(id) {
      this.db.set("lastWorkOrderId", id);
    },
    _getLastWorkOrderId() {
      return this.db.get("lastWorkOrderId");
    },
  },
  hooks: {
    async deploy() {
      const { workOrders } = await this.maintainx.getWorkOrders({
        params: {
          limit: 10,
        },
      });

      workOrders.reverse().forEach(this.emitEvent);
    },
  },
  async run() {
    const lastWorkOrderId = this._getLastWorkOrderId();

    let cursor;

    do {
      const {
        nextCursor, workOrders,
      } = await this.maintainx.getWorkOrders({
        params: {
          cursor,
          limit: 100,
        },
      });

      workOrders.reverse().forEach(this.emitEvent);

      if (
        workOrders.length < 100 ||
        workOrders.filter((workOrder) => workOrder.id === lastWorkOrderId)
      ) {
        return;
      }

      cursor = nextCursor;
    } while (cursor);
  },
};
