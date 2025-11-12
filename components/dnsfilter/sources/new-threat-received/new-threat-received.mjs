import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dnsfilter-new-threat-received",
  name: "New Threat Received",
  description: "Emit new event when a user's DNS query is blocked by a policy. [See the documentation](https://app.swaggerhub.com/apis-docs/DNSFilter/dns-filter_api/1.0.15#/TrafficReports/TrafficReports-total_threats)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(total) {
      const ts = Date.now();
      return {
        id: ts,
        summary: `${total} new threats received`,
        ts,
      };
    },
  },
  async run() {
    const lastTs = this._getLast();
    const params = lastTs
      ? {
        from: lastTs,
      }
      : {};
    const { data } = await this.dnsfilter.getTotalThreatsTrafficReport({
      params,
    });
    let total = 0;
    for (const item of data.values) {
      total += item.total;
    }
    if (total > 0) {
      const meta = this.generateMeta(total);
      this.$emit(data, meta);
    }
    this._setLast((new Date()).toISOString());
  },
  sampleEmit,
};
