import { ConfigurationError } from "@pipedream/platform";
import tapfiliate from "../../tapfiliate.app.mjs";

export default {
  key: "tapfiliate-set-parent-affiliate",
  name: "Set Parent Affiliate",
  description: "Sets an affiliate as the parent for another. Useful for managing the Multi Level Marketing (MLM) structure. [See the documentation](https://tapfiliate.com/docs/rest/#affiliates-mlm-parent-affiliate-post)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    tapfiliate,
    childAffiliateId: {
      propDefinition: [
        tapfiliate,
        "affiliateId",
      ],
      label: "Child Affiliate ID",
      description: "The ID of the affiliate whose parent is being set",
    },
    parentAffiliateId: {
      propDefinition: [
        tapfiliate,
        "affiliateId",
      ],
      label: "Parent Affiliate ID",
      description: "The ID of the parent affiliate",
    },
  },
  async run({ $ }) {
    const {
      childAffiliateId, parentAffiliateId,
    } = this;

    if (childAffiliateId === parentAffiliateId) {
      throw new ConfigurationError("Parent Affiliate ID must be different from Child Affiliate ID.");
    }

    const response = await this.tapfiliate.setParentAffiliate({
      $,
      childAffiliateId,
      data: {
        affiliate_id: parentAffiliateId,
      },
    });

    $.export("$summary", `Successfully set ${parentAffiliateId} as parent of ${childAffiliateId}`);

    return response;
  },
};
