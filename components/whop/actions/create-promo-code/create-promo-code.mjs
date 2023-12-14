import whop from "../../whop.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "whop-create-promo-code",
  name: "Create Promo Code",
  description: "Creates a new promo code with the given parameters in Whop. [See the documentation](https://dev.whop.com/api-reference/v2/promo-codes/create-a-promo-code)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    whop,
    promotionDetails: {
      propDefinition: [
        whop,
        "promotionDetails",
      ],
    },
    planParameters: {
      propDefinition: [
        whop,
        "planParameters",
      ],
    },
    userEligibilityDetails: {
      propDefinition: [
        whop,
        "userEligibilityDetails",
      ],
      optional: true,
    },
    usageLimit: {
      propDefinition: [
        whop,
        "usageLimit",
      ],
      optional: true,
    },
    expirationDate: {
      propDefinition: [
        whop,
        "expirationDate",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const promoCodeData = await this.whop.createPromoCode({
      promotionDetails: this.promotionDetails,
      planParameters: this.planParameters,
      userEligibilityDetails: this.userEligibilityDetails,
      usageLimit: this.usageLimit,
      expirationDate: this.expirationDate,
    });

    $.export("$summary", `Successfully created promo code with ID: ${promoCodeData.id}`);
    return promoCodeData;
  },
};
