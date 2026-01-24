import paystack from "../../paystack.app.mjs";

export default {
  key: "paystack-initialize-direct-debit",
  name: "Initialize Direct Debit",
  description: "Initialize the process of linking an account to a customer for Direct Debit transactions. [See the documentation](https://paystack.com/docs/api/customer/#initialize-direct-debit)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: false,
  },
  props: {
    paystack,
    customerId: {
      propDefinition: [
        paystack,
        "customerID",
      ],
    },
    accountNumber: {
      propDefinition: [
        paystack,
        "accountNumber",
      ],
      description: "The customer's bank account number",
    },
    bankCode: {
      propDefinition: [
        paystack,
        "bankCode",
      ],
      description: "The code representing the customer's bank",
    },
    street: {
      type: "string",
      label: "Street",
      description: "The customer's street address",
    },
    city: {
      type: "string",
      label: "City",
      description: "The customer's city",
    },
    state: {
      type: "string",
      label: "State",
      description: "The customer's state",
    },
  },
  async run({ $ }) {
    const response = await this.paystack.initializeDirectDebit({
      $,
      customerId: this.customerId,
      data: {
        account: {
          number: this.accountNumber,
          bank_code: this.bankCode,
        },
        address: {
          street: this.street,
          city: this.city,
          state: this.state,
        },
      },
    });

    $.export("$summary", `Successfully initialized Direct Debit for customer ${this.customerId}`);
    return response;
  },
};
