import base from "../common/base.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "square-new-customer-created",
  name: "New Customer Created",
  description: "Emit new event for every new customer created",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  hooks: {
    ...base.hooks,
    async deploy() {
      console.log(`Retrieving at most last ${constants.MAX_HISTORICAL_EVENTS} objects...`);
      const response = await this.square.listCustomers({
        params: {
          sort_order: "DESC",
          limit: constants.MAX_HISTORICAL_EVENTS,
        },
      });
      response?.objects?.forEach((object) => this.$emit(object, {
        id: object.id,
        summary: `Customer created: ${object.id}`,
        ts: object.created_at,
      }));
    },
  },
  methods: {
    ...base.methods,
    getEventTypes() {
      return [
        "customer.created",
      ];
    },
    getSummary(event) {
      return `Customer created: ${event.data.id}`;
    },
    getTimestamp(event) {
      return new Date(event.data.object.customer_created.created_at);
    },
  },
};
