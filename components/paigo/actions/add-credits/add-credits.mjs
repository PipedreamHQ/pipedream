import paigo from "../../paigo.app.mjs";

export default {
  key: "paigo-add-credits",
  name: "Add Credits",
  description: "Increments the credit balance of a specific customer. [See the documentation](http://www.api.docs.paigo.tech/#tag/Customers/operation/Create%20a%20wallet%20transaction)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    paigo,
    customerId: {
      propDefinition: [
        paigo,
        "customerId",
      ],
    },
    creditAmount: {
      type: "string",
      label: "Credit Amount",
      description: "The amount to credit the customer. Can be positive or negative. Customers cannot have a negative balance set via the API.",
    },
  },
  async run({ $ }) {
    const response = await this.paigo.incrementCreditBalance({
      $,
      customerId: this.customerId,
      data: {
        transactionAmount: this.creditAmount,
      },
    });
    $.export("$summary", `Successfully added ${this.creditAmount} credits to customer ${this.customerId}`);
    return response;
  },
};
