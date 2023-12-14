import whop from "../../whop.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "whop-create-checkout-session",
  name: "Create Checkout Session",
  description: "Creates a new checkout session in Whop. [See the documentation](https://dev.whop.com/api-reference/v2/checkout-sessions/create-a-checkout-session)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    whop,
    membershipInformation: {
      propDefinition: [
        whop,
        "membershipInformation",
      ],
    },
    checkoutData: {
      propDefinition: [
        whop,
        "checkoutData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.whop.createCheckoutSession({
      membershipInformation: this.membershipInformation,
      checkoutData: this.checkoutData,
    });

    $.export("$summary", `Successfully created a new checkout session with ID: ${response.id}`);
    return response;
  },
};
