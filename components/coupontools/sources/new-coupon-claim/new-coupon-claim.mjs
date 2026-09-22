import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "coupontools-new-coupon-claim",
  name: "New Coupon Claim",
  description: "Emit new event whenever a coupon has a new claim. [See the documentation](https://docs.coupontools.com/api/coupon#list-sessions)",
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
      return item.status.claim_date_utc;
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
        type: "claims",
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
        summary: `New coupon claim at ${timestamp}`,
        ts: Date.parse(timestamp),
      };
    },
  },
};
