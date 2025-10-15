import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-get-payment",
  name: "Get Payment",
  description: "Returns info about a payment. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/payment#read-a-payment)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    quickbooks,
    paymentId: {
      propDefinition: [
        quickbooks,
        "paymentId",
      ],
    },
  },
  async run({ $ }) {
    if (!this.paymentId) {
      throw new ConfigurationError("Must provide paymentId parameter.");
    }

    const response = await this.quickbooks.getPayment({
      $,
      paymentId: this.paymentId,
    });

    if (response) {
      $.export("summary", `Successfully retrieved payment with ID ${response.Payment.Id}`);
    }

    return response;
  },
};
