import paystack from "../../paystack.app.mjs";

export default {
  key: "paystack-deactivate-authorization",
  name: "Deactivate Authorization",
  description: "Deactivate an authorization when the card needs to be forgotten. [See the documentation](https://paystack.com/docs/api/customer/#deactivate-authorization)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: false,
    readOnlyHint: false,
  },
  props: {
    paystack,
    authorizationCode: {
      type: "string",
      label: "Authorization Code",
      description: "Authorization code to be deactivated",
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
