import shopwaive from "../../shopwaive.app.mjs";

export default {
  key: "shopwaive-set-available-balance",
  name: "Set Available Balance",
  description: "Updates the available balance of a customer to an exact value. [See the documentation](https://api.shopwaive.com/reference/rest-api-documentation/customer-api#set-customer-balance)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
    balance: {
      propDefinition: [
        shopwaive,
        "amount",
      ],
      label: "New Balance",
      description: "Value to assign to the customer's available balance",
    },
    note: {
      propDefinition: [
        shopwaive,
        "note",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.shopwaive.updateCustomerBalance({
      $,
      data: {
        customer_email: this.customerEmail,
        balance: this.balance,
        note: this.note,
      },
    });

    $.export("$summary", `Successfully set balance for ${this.customerEmail} to ${this.balance}`);
    return response;
  },
};
