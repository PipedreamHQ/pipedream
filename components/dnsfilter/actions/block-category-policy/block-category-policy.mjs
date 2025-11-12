import dnsfilter from "../../dnsfilter.app.mjs";

export default {
  key: "dnsfilter-block-category-policy",
  name: "Block Category From Policy",
  description: "Blocks a selected category from a policy applied to your DNSFilter account's sites or roaming clients. [See the documentation](https://app.swaggerhub.com/apis-docs/DNSFilter/dns-filter_api/1.0.15#/Policies/Policies-add_blacklist_category)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dnsfilter,
    policyId: {
      propDefinition: [
        dnsfilter,
        "policyId",
      ],
    },
    categoryId: {
      propDefinition: [
        dnsfilter,
        "categoryId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dnsfilter.blockCategoryFromPolicy({
      policyId: this.policyId,
      data: {
        category_id: this.categoryId,
      },
      $,
    });
    $.export("$summary", `Successfully blocked category ${this.categoryId} from policy ${this.policyId}.`);
    return response;
  },
};
