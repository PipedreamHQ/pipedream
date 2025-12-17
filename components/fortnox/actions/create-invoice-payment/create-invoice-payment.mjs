import fortnox from "../../fortnox.app.mjs";

export default {
  key: "fortnox-create-invoice-payment",
  name: "Create Invoice Payment",
  description: "Creates a new invoice payment in the Fortnox API. [See the documentation](https://api.fortnox.se/apidocs#tag/fortnox_InvoicePayments/operation/create_22).",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    fortnox,
    invoiceNumber: {
      propDefinition: [
        fortnox,
        "invoiceNumber",
      ],
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The amount of the payment",
      optional: true,
    },
    paymentDate: {
      type: "string",
      label: "Payment Date",
      description: "The date of the payment. **Format YYYY-MM-DD**",
      optional: true,
    },
    voucherNumber: {
      propDefinition: [
        fortnox,
        "voucherNumber",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.fortnox.createInvoicePayment({
      $,
      data: {
        InvoicePayment: {
          InvoiceNumber: this.invoiceNumber,
          Amount: this.amount
            ? +this.amount
            : undefined,
          PaymentDate: this.paymentDate,
          VoucherNumber: this.voucherNumber,
        },
      },
    });
    $.export("$summary", `Successfully created invoice payment with ID \`${response.InvoicePayment.Number}\``);
    return response;
  },
};
