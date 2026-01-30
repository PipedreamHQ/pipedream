import paystack from "../../paystack.app.mjs";

export default {
  key: "paystack-deactivate-authorization",
  name: "Deactivate Authorization",
  description: "Deactivate an authorization when the card needs to be forgotten. [See the documentation](https://paystack.com/docs/api/customer/#deactivate-authorization)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    paystack,
    customerCode: {
      propDefinition: [
        paystack,
        "customerCode",
      ],
      description: "Select a customer to view their authorizations",
    },
    authorizationCode: {
      propDefinition: [
        paystack,
        "authorization_code",
        ({ customerCode }) => ({
          customer: customerCode,
        }),
      ],
      description: "Select the authorization to deactivate or use the Fetch Transactions or Fetch Customer action to get the authorization code. This is created whenever a customer makes a payment on your integration.",
    },
  },
  async run({ $ }) {
    const response = await this.paystack.deactivateAuthorization({
      $,
      data: {
        authorization_code: this.authorizationCode,
      },
    });

    $.export("$summary", `Successfully deactivated authorization ${this.authorizationCode}`);
    return response;
  },
};
