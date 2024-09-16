import fakturoid from "../../fakturoid.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "fakturoid-pay-remove-payment-invoice",
  name: "Pay or Remove Payment for Invoice",
  description: "Executes payment for an invoice or removes an already applied payment. [See the documentation](https://www.fakturoid.cz/api/v3/invoice-payments)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    fakturoid,
    invoiceId: {
      propDefinition: [
        fakturoid,
        "invoiceId",
      ],
    },
    paymentValue: {
      propDefinition: [
        fakturoid,
        "paymentValue",
      ],
      optional: true,
    },
    actionType: {
      type: "string",
      label: "Action Type",
      description: "Specify if you want to execute or remove a payment",
      options: [
        {
          label: "Execute Payment",
          value: "execute",
        },
        {
          label: "Remove Payment",
          value: "remove",
        },
      ],
    },
    paymentId: {
      type: "string",
      label: "Payment ID",
      description: "ID of the payment to be removed. Required if action type is remove.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      actionType, invoiceId, paymentValue, paymentId,
    } = this;

    if (actionType === "execute") {
      const response = await this.fakturoid.payInvoice({
        invoiceId,
        paymentValue,
      });
      $.export("$summary", `Successfully executed payment for invoice ID ${invoiceId}`);
      return response;
    } else if (actionType === "remove") {
      if (!paymentId) {
        throw new Error("Payment ID must be provided to remove a payment");
      }
      const response = await this.fakturoid.removePayment({
        invoiceId,
        paymentId,
      });
      $.export("$summary", `Successfully removed payment ID ${paymentId} from invoice ID ${invoiceId}`);
      return response;
    } else {
      throw new Error("Invalid action type");
    }
  },
};
