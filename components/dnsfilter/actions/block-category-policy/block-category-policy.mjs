import dnsfilter from "../../dnsfilter.app.mjs";

export default {
  key: "dnsfilter-block-category-policy",
  name: "Block Category From Policy",
  description: "Blocks a selected category from a policy applied to your dnsfilter account's sites or roaming clients.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dnsfilter,
    policyName: dnsfilter.propDefinitions.policyName,
    categoryName: dnsfilter.propDefinitions.categoryName,
  },
  async run({ $ }) {
    const response = await this.dnsfilter.blockCategoryFromPolicy({
      policyName: this.policyName,
      categoryName: this.categoryName,
    });
    $.export("$summary", `Successfully blocked category ${this.categoryName} from policy ${this.policyName}`);
    return response;
  },
};
