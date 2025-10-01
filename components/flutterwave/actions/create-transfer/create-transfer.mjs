import flutterwave from "../../flutterwave.app.mjs";

export default {
  key: "flutterwave-create-transfer",
  name: "Create Transfer",
  description: "This action initiates a new transfer. [See the documentation](https://developer.flutterwave.com/reference/endpoints/transfers)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    flutterwave,
    country: {
      propDefinition: [
        flutterwave,
        "country",
      ],
    },
    bank: {
      propDefinition: [
        flutterwave,
        "bank",
        (c) => ({
          country: c.country,
        }),
      ],
    },
    accountNumber: {
      type: "string",
      label: "Account Number",
      description: "This is the recipient's account number.",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The currency of the Transfer. Learn more about supported currencies [here](https://flutterwave.com/gb/support/payments/what-currencies-can-you-transfer-to).",
    },
    amount: {
      type: "integer",
      label: "Amount",
      description: "This is the amount to be transferred to the recipient",
    },
    narration: {
      type: "string",
      label: "Narration",
      description: "This is the narration for the transfer e.g. payments for x services provided",
    },
    payoutSubaccount: {
      propDefinition: [
        flutterwave,
        "payoutSubaccount",
      ],
    },
    reference: {
      type: "string",
      label: "Reference",
      description: "This is a merchant's unique reference for the transfer, it can be used to query for the status of the transfer.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.flutterwave.initiateTransfer({
      $,
      data: {
        account_bank: this.bank,
        account_number: this.accountNumber,
        currency: this.currency,
        amount: this.amount,
        narration: this.narration,
        debit_subaccount: this.payoutSubaccount,
        reference: this.reference,
      },
    });

    if (response?.data?.id) {
      $.export("$summary", `Transfer initiated successfully with ID: ${response.data.id}.`);
    }
    return response;
  },
};
