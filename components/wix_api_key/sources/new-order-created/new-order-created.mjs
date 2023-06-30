import common from "../common/common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "wix_api_key-new-order-created",
  name: "New Order Created",
  description: "Emit new event when a new order is created. [See the documentation](https://dev.wix.com/api/rest/wix-stores/orders/query-orders)",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getParams() {
      return {
        query: {
          paging: {
            limit: constants.DEFAULT_LIMIT,
            offset: 0,
          },
        },
      };
    },
    async getResources({
      siteId, params,
    }) {
      const { orders } = await this.wix.listOrders({
        siteId,
        data: params,
      });
      return orders;
    },
    getTs(resource) {
      return Date.parse(resource.dateCreated);
    },
    advancePage(params) {
      params.query.paging.offset += constants.DEFAULT_LIMIT;
      return params;
    },
    generateMeta(order) {
      return {
        id: order.id,
        summary: `Order ID ${order.id}`,
        ts: this.getTs(order),
      };
    },
  },
};
