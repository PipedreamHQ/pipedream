import base from "../common/base.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "square-new-order-created",
  name: "New Order Created",
  description: "Emit new event for every new order created",
  type: "source",
  version: "0.0.1",
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
      const response = await this.square.listOrders({
        params: {
          limit: constants.MAX_HISTORICAL_EVENTS,
        },
        data: {
          query: {
            sort: {
              sort_field: "CREATED_AT",
              sort_order: "DESC",
            },
          },
          location_ids: [
            this.location,
          ],
        },
      });
      response?.objects?.slice(-constants.MAX_HISTORICAL_EVENTS)
        .reverse()
        .forEach((object) => this.$emit(object, {
          id: object.id,
          summary: `Invoice created: ${object.id}`,
          ts: object.created_at,
        }));
    },
  },
  methods: {
    ...base.methods,
    getEventTypes() {
      return [
        "order.created",
      ];
    },
    getSummary(event) {
      return `Order created: ${event.data.id}`;
    },
    getTimestamp(event) {
      return new Date(event.data.object.order_created.created_at);
    },
    isRelevant(event) {
      return event.data.object.order_created.location_id === this.location;
    },
  },
};
