import storeganise from "../../storeganise.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "storeganise-add-invoice-payment",
  name: "Add Invoice Payment",
  description: "Adds a payment to the targeted invoice. Requires invoice id and the payment amount as props. Can also include payment date and payment method as optional props.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    storeganise,
    invoiceId: {
      propDefinition: [
        storeganise,
        "invoiceId",
      ],
    },
    paymentAmount: {
      propDefinition: [
        storeganise,
        "paymentAmount",
      ],
    },
    paymentDate: {
      propDefinition: [
        storeganise,
        "paymentDate",
      ],
      optional: true,
    },
    paymentMethod: {
      propDefinition: [
        storeganise,
        "paymentMethod",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.storeganise.addPaymentToInvoice(this.invoiceId, this.paymentAmount, this.paymentDate, this.paymentMethod);
    $.export("$summary", `Successfully added payment to invoice ${this.invoiceId}`);
    return response;
  },
};
