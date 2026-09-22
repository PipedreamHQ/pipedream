import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "coupontools-new-coupon-validation",
  name: "New Coupon Validation",
  description: "Emit new event when a coupon has been validated. [See the documentation](https://docs.coupontools.com/api/coupon#list-sessions)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    couponId: {
      propDefinition: [
        common.props.coupontools,
        "couponId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getTimestamp(item) {
      return item.status.validation_date_utc;
    },
    getResults(max, lastTs) {
      const data = {
        campaign: this.couponId,
      };
      if (lastTs) {
        data.start_date = this.formatTimestamp(lastTs);
        data.end_date = this.formatTimestamp(Date.now());
      }
      return this.paginateSessions({
        type: "validations",
        args: {
          data,
        },
        lastTs,
        max,
      });
    },
    generateMeta(item) {
      const timestamp = this.getTimestamp(item);
      return {
        id: item.session,
        summary: `New coupon validation at ${timestamp}`,
        ts: Date.parse(timestamp),
      };
    },
  },
};
