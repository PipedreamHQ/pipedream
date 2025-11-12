import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dnsfilter-new-policy-created",
  name: "New Policy Created",
  description: "Emit new event when a new policy is created. [See the documentation](https://app.swaggerhub.com/apis-docs/DNSFilter/dns-filter_api/1.0.15#/Policies/Policies-index)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(policy) {
      return {
        id: policy.id,
        summary: `New Policy ${policy.attributes.name}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const lastPolicyId = this._getLast();
    let maxId = lastPolicyId;
    const args = {};

    do {
      const {
        data, links,
      } = await this.dnsfilter.listPolicies();
      for (const item of data) {
        if (item.id > lastPolicyId) {
          const meta = this.generateMeta(item);
          this.$emit(item, meta);
          if (item.id > maxId) {
            maxId = item.id;
          }
        }
      }
      args.url = links?.next;
    } while (args.url);

    this._setLast(maxId);
  },
  sampleEmit,
};
