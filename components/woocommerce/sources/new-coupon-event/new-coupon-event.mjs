import common from "../common/base.mjs";

export default {
  ...common,
  key: "woocommerce-new-coupon-event",
  name: "New Coupon Event (Instant)",
  description: "Emit new event each time the specified coupon event(s) occur",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getSampleEvents({ perPage }) {
      return this.woocommerce.listCoupons({
        per_page: perPage,
        orderby: "date",
      });
    },
    getTopic(topicType) {
      return `coupon.${topicType}`;
    },
    generateMeta(eventType, {
      id, date_modified: dateModified,
    }) {
      const ts = Date.parse(dateModified);
      return {
        id: `${id}${ts}`,
        summary: `Coupon ID: ${id} ${eventType}`,
        ts,
      };
    },
  },
};
