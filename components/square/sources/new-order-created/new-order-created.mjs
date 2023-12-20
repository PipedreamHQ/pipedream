import base from "../common/base-polling.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "square-new-order-created",
  name: "New Order Created",
  description: "Emit new event for every new order created. [See the docs](https://developer.squareup.com/reference/square/orders-api/search-orders)",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    ...base.props,
    location: {
      propDefinition: [
        base.props.square,
        "location",
      ],
    },
  },
  hooks: {
    ...base.hooks,
    async deploy() {
      console.log(`Retrieving at most last ${constants.MAX_HISTORICAL_EVENTS} objects...`);
      const { order_entries: orders } = await this.square.listOrders({
        data: {
          ...this.getBaseParams(),
        },
      });
      if (!(orders?.length > 0)) {
        return;
      }
      this._setLastTs(Date.parse(orders[0].created_at));
      orders?.slice(0, constants.MAX_HISTORICAL_EVENTS)
        .reverse()
        .forEach((order) => this.$emit(order, this.generateMeta(order)));
    },
  },
  methods: {
    ...base.methods,
    getBaseParams() {
      return {
        limit: constants.MAX_LIMIT,
        location_ids: [
          this.location,
        ],
        query: {
          sort: {
            sort_field: "CREATED_AT",
            sort_order: "DESC",
          },
        },
      };
    },
    generateMeta(order) {
      return {
        id: order.id,
        summary: `Order created: ${order.id}`,
        ts: Date.parse(order.created_at),
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let newLastTs;
    let cursor;
    let done = false;

    do {
      const response = await this.square.listOrders({
        data: {
          ...this.getBaseParams(),
          cursor,
        },
      });
      const { orders } = response;
      if (!(orders?.length > 0)) {
        break;
      }
      if (!newLastTs) {
        newLastTs = Date.parse(orders[0].created_at);
      }
      for (const order of orders) {
        if (Date.parse(order.created_at) <= lastTs) {
          done = true;
          break;
        }
        this.emitEvent(order);
      }
      cursor = response?.cursor;
    } while (cursor && !done);

    this._setLastTs(newLastTs);
  },
};
