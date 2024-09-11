import storeganise from "../../storeganise.app.mjs";

export default {
  key: "storeganise-add-invoice-payment",
  name: "Add Invoice Payment",
  description: "Adds a payment to the targeted invoice. [See the documentation](https://pipedream-dev-trial.storeganise.com/api/docs/admin/invoices#admin_invoices._invoiceId_payments)",
  version: "0.0.1",
  type: "action",
  props: {
    storeganise,
    invoiceId: {
      propDefinition: [
        storeganise,
        "invoiceId",
      ],
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The payment amount",
    },
    method: {
      type: "string",
      label: "Method",
      description: "The payment method",
      options: [
        "cash",
        "card",
        "cheque",
        "transfer",
        "other",
      ],
    },
    paymentDate: {
      type: "string",
      label: "Payment Date",
      description: "The date of the payment in YYYY-MM-DD format (e.g., `2018-02-18`)",
    },
    note: {
      type: "string",
      label: "Note",
      description: "The content of the note",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.storeganise.addPaymentToInvoice({
      $,
      invoiceId: this.invoiceId,
      data: {
        type: "manual",
        amount: this.amount,
        method: this.method,
        date: this.paymentDate,
        notes: this.note,
      },
    });
    $.export("$summary", `Successfully added payment to invoice ${this.invoiceId}`);
    return response;
  },
};
