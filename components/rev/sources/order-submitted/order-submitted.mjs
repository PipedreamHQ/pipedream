import rev from "../../rev.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import constants from "../../common/constants.mjs";

export default {
  key: "rev-order-submitted",
  name: "Order Submitted",
  description: "Emit new event when a order is submitted. [See docs here.](https://www.rev.com/api/ordersget)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    rev,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    orderTypes: {
      type: "string[]",
      label: "Order Types",
      description: "Emit only specific order types",
      options: constants.ORDER_TYPES,
    },
    orderStatus: {
      type: "string",
      label: "Order Status",
      description: "Whether to emit only completed orders or all statuses",
      optional: true,
      options: constants.ORDER_STATUSES,
    },
    orderPriorities: {
      type: "string[]",
      label: "Order Priorities",
      description: "Emit only specific order priorities",
      optional: true,
      options: constants.ORDER_PRIORITIES,
    },
  },
  methods: {
    _getPage() {
      return this.db.get("page") || 0;
    },
    _setPage(page) {
      this.db.set("page", page);
    },
    filterByTypes(order) {
      const keys = Object.keys(order);
      return this.orderTypes
        .map((orderType) => keys.includes(orderType))
        .some((result) => result === true);
    },
    filterByStatus({ status }) {
      return this.orderStatus == null || this.orderStatus === status;
    },
    filterByPriorities({ priority }) {
      return this.orderPriorities?.includes(priority) ?? true;
    },
  },
  async run() {
    let page = this._getPage();

    const {
      orders,
      results_per_page: resultsPerPage,
    } = await this.rev.getOrders({
      params: {
        page,
        pageSize: constants.MAX_PAGE_SIZE,
      },
    });

    if (orders.length === resultsPerPage) {
      this._setPage(++page);
    }

    orders
      .filter(this.filterByTypes)
      .filter(this.filterByStatus)
      .filter(this.filterByPriorities)
      .forEach((order) => {
        this.$emit(order, {
          id: `${order.order_number}-${order.status}`,
          summary: `New order with ID: ${order.order_number}`,
          ts: new Date(),
        });
      });
  },
};
