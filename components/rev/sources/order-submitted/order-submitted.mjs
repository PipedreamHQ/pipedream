import rev from "../../rev.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import constants from "../../common/constants.mjs";

export default {
  key: "rev-order-submitted",
  name: "Order Submitted",
  description: "Emit new event when an order is submitted. [See docs here.](https://www.rev.com/api/ordersget)",
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
  hooks: {
    async deploy() {
      let page = 0;
      let allOrders = [];

      while (true) {
        const {
          orders,
          results_per_page: resultsPerPage,
        } = await this.rev.getOrders({
          params: {
            page,
            pageSize: constants.MAX_PAGE_SIZE,
          },
        });

        allOrders.push(...orders);

        if (orders.length < resultsPerPage) {
          break;
        }

        page++;
      }

      this._setPage(page);
      this.emitEvents(allOrders.slice(-25));
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
    emitEvents(orders) {
      for (const order of orders) {
        this.$emit(order, {
          id: `${order.order_number}-${order.status}`,
          summary: `New order with ID: ${order.order_number}`,
          ts: new Date(),
        });
      }
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

    const filteredOrders = orders
      .filter(this.filterByTypes)
      .filter(this.filterByStatus)
      .filter(this.filterByPriorities);

    this.emitEvents(filteredOrders);
  },
};
