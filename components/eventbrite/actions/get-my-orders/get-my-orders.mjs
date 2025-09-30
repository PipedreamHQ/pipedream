import eventbrite from "../../eventbrite.app.mjs";

export default {
  key: "eventbrite-get-my-orders",
  name: "Get My Orders",
  description: "Get a list of event orders placed by the authenticated user. [See the documentation](https://www.eventbrite.com/platform/docs/order-lookup)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    eventbrite,
  },
  methods: {
    async *orderStream($) {
      const params = {};
      let hasMoreItems;
      do {
        const {
          orders,
          pagination = {},
        } = await this.eventbrite.listUserOrders({
          $,
          params,
        });
        for (const order of orders) {
          yield order;
        }

        hasMoreItems = !!pagination.has_more_items;
        params.continuation = pagination.continuation;
      } while (hasMoreItems);
    },
  },
  async run({ $ }) {
    const orderStream = await this.orderStream($);
    const orders = [];
    for await (const order of orderStream) {
      orders.push(order);
    }
    $.export("$summary", `Successfully fetched ${orders.length} orders`);
    return orders;
  },
};
