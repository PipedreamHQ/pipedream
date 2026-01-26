import paystack from "../../paystack.app.mjs";

export default {
  key: "paystack-direct-debit-activation-charge",
  name: "Direct Debit Activation Charge",
  description: "Trigger an activation charge on an inactive mandate on behalf of your customer. [See the documentation](https://paystack.com/docs/api/customer/#directdebit-activation-charge)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    paystack,
    customerId: {
      propDefinition: [
        paystack,
        "customerID",
      ],
      description: "The customer ID attached to the authorization",
    },
    authorizationId: {
      type: "integer",
      label: "Authorization ID",
      description: "The authorization ID gotten from the initiation response",
    },
  },
  async run({ $ }) {
    const response = await this.paystack.directDebitActivationCharge({
      $,
      customerId: this.customerId,
      data: {
        authorization_id: this.authorizationId,
      },
    });

    $.export("$summary", `Successfully triggered activation charge for customer ${this.customerId}`);
    return response;
  },
};
