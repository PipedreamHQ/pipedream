import { parseObject } from "../../common/utils.mjs";
import leaddyno from "../../leaddyno.app.mjs";

export default {
  key: "leaddyno-create-purchase",
  name: "Create Purchase",
  description: "Creates a new purchase in LeadDyno. [See the documentation](https://app.theneo.io/leaddyno/leaddyno-rest-api/purchases/post-purchases)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    leaddyno,
    email: {
      propDefinition: [
        leaddyno,
        "leadEmail",
      ],
    },
    purchaseCode: {
      type: "string",
      label: "Purchase Code",
      description: "A unique identifier for this purchase. If not provided, a unique ID will be generated",
      optional: true,
    },
    purchaseAmount: {
      type: "string",
      label: "Purchase Amount",
      description: "The total amount of the purchase, used for percentage commission calculations",
      optional: true,
    },
    planCode: {
      type: "string",
      label: "Plan Code",
      description: "The code of the reward structure used for calculating affiliate commissions",
      optional: true,
    },
    affiliateCode: {
      propDefinition: [
        leaddyno,
        "affiliateCode",
      ],
      optional: true,
    },
    commissionAmount: {
      type: "string",
      label: "Commission Amount Override",
      description: "An overriding commission amount that will replace any predefined plan and provide an immediate fixed-amount commission. This value should be a decimal",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Text description of the purchase",
      optional: true,
    },
    reassignAffiliate: {
      type: "boolean",
      label: "Reassign Affiliate",
      description: "If set to false, the original affiliate of the lead will be retained.",
      optional: true,
    },
    lineItems: {
      type: "string[]",
      label: "Line Items",
      description: "A list of JSON object containing the line items associated with the purchase. **Format: [{\"sku\": \"string\", \"description\": \"string\", \"quantity\": \"string\", \"amount\": \"string\"}]**",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.leaddyno.createPurchase({
      $,
      data: {
        email: this.email,
        purchase_code: this.purchaseCode,
        purchase_amount: this.purchaseAmount && parseFloat(this.purchaseAmount),
        plan_code: this.planCode,
        code: this.affiliateCode,
        commission_amount_override: this.commissionAmount && parseFloat(this.commissionAmount),
        description: this.description,
        reassign_affiliate: this.reassignAffiliate,
        line_items: parseObject(this.lineItems),
      },
    });

    $.export("$summary", `Successfully created purchase with ID ${response.id}`);

    return response;
  },
};
