import clear_books from "../../clear_books.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "clear_books-record-payment",
  name: "Record Payment",
  description: "Records a payment against an existing invoice. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    clear_books: {
      type: "app",
      app: "clear_books",
    },
    recordPaymentAmount: {
      propDefinition: [
        "clear_books",
        "recordPaymentAmount",
      ],
    },
    recordInvoiceId: {
      propDefinition: [
        "clear_books",
        "recordInvoiceId",
      ],
    },
    recordPaymentDate: {
      propDefinition: [
        "clear_books",
        "recordPaymentDate",
      ],
    },
    recordPaymentMethod: {
      propDefinition: [
        "clear_books",
        "recordPaymentMethod",
      ],
    },
  },
  async run({ $ }) {
    const paymentData = {
      amount: this.recordPaymentAmount,
      invoice_id: this.recordInvoiceId,
      payment_date: this.recordPaymentDate,
    };
    if (this.recordPaymentMethod) {
      paymentData.payment_method = this.recordPaymentMethod;
    }
    const response = await this.clear_books.recordPayment(paymentData);
    $.export("$summary", `Recorded payment of $${this.recordPaymentAmount} on invoice ${this.recordInvoiceId}`);
    return response;
  },
};
