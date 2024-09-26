import paystack from "../../paystack.app.mjs";

export default {
  key: "paystack-charge-authorization",
  name: "Charge Authorization",
  description: "Charge a reusable authorization. [See the documentation](https://paystack.com/docs/api/transaction/#charge-authorization)",
  version: "0.0.2",
  type: "action",
  props: {
    paystack,
    email: {
      propDefinition: [
        paystack,
        "email",
      ],
    },
    amount: {
      propDefinition: [
        paystack,
        "amount",
      ],
    },
    authorization_code: {
      propDefinition: [
        paystack,
        "authorization_code",
        (configuredProps) => ({
          customer: configuredProps.email,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.paystack.chargeAuthorization({
      $,
      data: {
        email: this.email,
        amount: this.amount,
        authorization_code: this.authorization_code,
      },

    });

    $.export("$summary", "Authorization charged");
    return response;
  },
};
