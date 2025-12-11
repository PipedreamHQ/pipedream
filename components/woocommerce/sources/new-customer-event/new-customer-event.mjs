import common from "../common/base.mjs";

export default {
  ...common,
  key: "woocommerce-new-customer-event",
  name: "New Customer Event (Instant)",
  description: "Emit new event each time the specified customer event(s) occur",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getSampleEvents({ perPage }) {
      return this.woocommerce.listCustomers({
        per_page: perPage,
        orderby: "registered_date",
      });
    },
    getTopic(topicType) {
      return `customer.${topicType}`;
    },
    generateMeta(eventType, {
      id, username, date_modified: dateModified,
    }) {
      const ts = Date.parse(dateModified);
      return {
        id: `${id}${ts}`,
        summary: `Customer "${username || id}" ${eventType}`,
        ts,
      };
    },
  },
};
