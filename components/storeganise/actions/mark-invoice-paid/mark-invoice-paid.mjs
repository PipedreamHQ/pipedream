import storeganise from "../../storeganise.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "storeganise-mark-invoice-paid",
  name: "Mark Invoice as Paid",
  description: "Marks the selected invoice as paid in Storeganise. [See the documentation](https://help.storeganise.com/article/21-api-faq)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    storeganise,
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "The ID of the invoice",
    },
    paymentDate: {
      type: "string",
      label: "Payment Date",
      description: "The date of the payment (optional)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.storeganise.markInvoicePaid(this.invoiceId, this.paymentDate);
    $.export("$summary", `Invoice ${this.invoiceId} was marked as paid successfully`);
    return response;
  },
};
