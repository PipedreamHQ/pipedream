import storeganise from "../../storeganise.app.mjs";

export default {
  key: "storeganise-add-invoice-payment",
  name: "Add Invoice Payment",
  description: "Adds a payment to the targeted invoice. [See the documentation]()",
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
    type: {
      type: "string",
      label: "Type",
      description: "The type of payment",
      options: [
        "credit",
        "braintree",
        "stripe",
        "manual",
      ],
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The payment amount",
    },
    paymentDate: {
      propDefinition: [
        storeganise,
        "paymentDate",
      ],
    },
    note: {
      propDefinition: [
        storeganise,
        "note",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.storeganise.addPaymentToInvoice({
      $,
      invoiceId: this.invoiceId,
      data: {
        type: this.type,
        amount: this.amount,
        date: this.paymentDate,
        notes: this.note,
      },
    });
    $.export("$summary", `Successfully added payment to invoice ${this.invoiceId}`);
    return response;
  },
};
