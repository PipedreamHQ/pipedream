import shopwaive from "../../shopwaive.app.mjs";

export default {
  key: "shopwaive-adjust-available-balance",
  name: "Adjust Available Balance",
  description: "Adjusts the available balance of a customer. [See the documentation](https://api.shopwaive.com/reference/rest-api-documentation/customer-api#adjust-customer-balance)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shopwaive,
    customerEmail: {
      propDefinition: [
        shopwaive,
        "customerEmail",
      ],
    },
    amount: {
      propDefinition: [
        shopwaive,
        "amount",
      ],
    },
    note: {
      propDefinition: [
        shopwaive,
        "note",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.shopwaive.increaseCustomerBalance({
      $,
      data: {
        customer_email: this.customerEmail,
        amount: this.amount,
        note: this.note,
      },
    });
    $.export("$summary", `Successfully adjusted balance for ${this.customerEmail} by ${this.amount}`);
    return response;
  },
};
