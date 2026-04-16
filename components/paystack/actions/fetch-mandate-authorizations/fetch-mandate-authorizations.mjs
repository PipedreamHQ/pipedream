import paystack from "../../paystack.app.mjs";

export default {
  key: "paystack-fetch-mandate-authorizations",
  name: "Fetch Mandate Authorizations",
  description: "Get the list of direct debit mandates associated with a customer. [See the documentation](https://paystack.com/docs/api/customer/#fetch-mandate-authorizations)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    paystack,
    customerId: {
      propDefinition: [
        paystack,
        "customerID",
      ],
      description: "The customer ID for the authorizations to fetch",
    },
  },
  async run({ $ }) {
    const response = await this.paystack.fetchMandateAuthorizations({
      $,
      customerId: this.customerId,
    });

    $.export("$summary", `Successfully fetched mandate authorizations for customer ${this.customerId}`);
    return response;
  },
};
