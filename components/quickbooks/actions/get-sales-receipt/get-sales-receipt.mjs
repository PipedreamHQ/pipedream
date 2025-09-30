import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-get-sales-receipt",
  name: "Get Sales Receipt",
  description: "Returns details about a sales receipt. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/salesreceipt#read-a-salesreceipt)",
  version: "0.1.12",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    quickbooks,
    salesReceiptId: {
      propDefinition: [
        quickbooks,
        "salesReceiptId",
      ],
    },
  },
  async run({ $ }) {
    if (!this.salesReceiptId) {
      throw new ConfigurationError("Must provide salesReceiptId parameter.");
    }

    const response = await this.quickbooks.getSalesReceipt({
      $,
      salesReceiptId: this.salesReceiptId,
    });

    if (response) {
      $.export("summary", `Successfully retrieved sales receipt with ID ${response.SalesReceipt.Id}`);
    }

    return response;
  },
};
