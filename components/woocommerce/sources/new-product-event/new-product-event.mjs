import common from "../common/base.mjs";

export default {
  ...common,
  key: "woocommerce-new-product-event",
  name: "New Product Event (Instant)",
  description: "Emit new event each time the specified product event(s) occur",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getSampleEvents({ perPage }) {
      return this.woocommerce.listProducts({
        per_page: perPage,
        orderby: "date",
      });
    },
    getTopic(topicType) {
      return `product.${topicType}`;
    },
    generateMeta(eventType, {
      id, name, date_modified: dateModified,
    }) {
      const ts = Date.parse(dateModified);
      return {
        id: `${id}${ts}`,
        summary: `Product "${name || id}" ${eventType}`,
        ts,
      };
    },
  },
};
