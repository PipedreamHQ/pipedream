import { parseString } from "../../common/utils.mjs";
import whop from "../../whop.app.mjs";

export default {
  key: "whop-create-checkout-session",
  name: "Create Checkout Session",
  description: "Creates a new checkout session in Whop. [See the documentation](https://dev.whop.com/api-reference/v2/checkout-sessions/create-a-checkout-session)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    whop,
    affiliateCode: {
      propDefinition: [
        whop,
        "affiliateCode",
      ],
      optional: true,
    },
    metadata: {
      propDefinition: [
        whop,
        "metadata",
      ],
      optional: true,
    },
    planId: {
      propDefinition: [
        whop,
        "planId",
      ],
    },
    redirectUrl: {
      type: "string",
      label: "Redirect Url",
      description: "The URL the user will be navigated to after successfully completing a checkout with this session.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.whop.createCheckoutSession({
      data: {
        affiliate_code: this.affiliateCode,
        metadata: parseString(this.metadata),
        plan_id: this.planId,
        redirect_url: this.redirectUrl,
      },
    });

    $.export("$summary", `Successfully created a new checkout session with ID: ${response.id}`);
    return response;
  },
};

