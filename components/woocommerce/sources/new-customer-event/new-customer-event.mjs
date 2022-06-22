import common from "../common/base.mjs";

export default {
  ...common,
  key: "woocommerce-new-customer-event",
  name: "New Customer Event",
  description: "Emit new event each time the specified customer event(s) occur",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
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
