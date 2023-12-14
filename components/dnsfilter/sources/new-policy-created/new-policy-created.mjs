import { axios } from "@pipedream/platform";
import dnsfilter from "../../dnsfilter.app.mjs";

export default {
  key: "dnsfilter-new-policy-created",
  name: "New Policy Created",
  description: "Emit new event when a new policy is created.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    dnsfilter,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    organizationName: {
      propDefinition: [
        dnsfilter,
        "organizationName",
      ],
    },
    location: {
      propDefinition: [
        dnsfilter,
        "location",
      ],
    },
    siteName: {
      propDefinition: [
        dnsfilter,
        "siteName",
      ],
    },
    policyName: {
      propDefinition: [
        dnsfilter,
        "policyName",
      ],
    },
    categoryName: {
      propDefinition: [
        dnsfilter,
        "categoryName",
      ],
    },
  },
  methods: {
    ...dnsfilter.methods,
    _getPolicyId() {
      return this.db.get("policyId") ?? null;
    },
    _setPolicyId(id) {
      this.db.set("policyId", id);
    },
  },
  hooks: {
    async deploy() {
      const policy = await this.dnsfilter.assignPolicyToSite({
        siteName: this.siteName,
        policyName: this.policyName,
      });

      await this.dnsfilter.blockCategoryFromPolicy({
        policyName: this.policyName,
        categoryName: this.categoryName,
      });

      this._setPolicyId(policy.id);
    },
  },
  async run() {
    const policyId = this._getPolicyId();

    const { data: policy } = await axios(this, {
      url: `${this.dnsfilter._baseUrl()}/policies/${policyId}`,
      headers: {
        Authorization: `Bearer ${this.dnsfilter.$auth.oauth_access_token}`,
      },
    });

    if (policy.id !== policyId) {
      this.$emit(policy, {
        id: policy.id,
        summary: `New Policy: ${policy.name}`,
        ts: Date.now(),
      });
      this._setPolicyId(policy.id);
    }
  },
};
