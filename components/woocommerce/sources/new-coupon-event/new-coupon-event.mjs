import common from "../common/base.mjs";

export default {
  ...common,
  key: "woocommerce-new-coupon-event",
  name: "New CouponEvent",
  description: "Emit new event each time the specified coupon event(s) occur",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
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
