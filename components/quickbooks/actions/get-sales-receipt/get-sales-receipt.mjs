import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-get-sales-receipt",
  name: "Get Sales Receipt",
  description: "Returns details about a sales receipt. [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/salesreceipt#read-a-salesreceipt)",
  version: "0.1.4",
  type: "action",
  props: {
    quickbooks,
    salesReceiptId: {
      label: "sales Receipt ID",
      type: "string",
      description: "Id of the sales receipt to get details of.",
    },
    minorVersion: {
      propDefinition: [
        quickbooks,
        "minorVersion",
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
      params: {
        minorversion: this.minorVersion,
      },
    });

    if (response) {
      $.export("summary", `Successfully retrieved sales receipt with id ${response.SalesReceipt.Id}`);
    }

    return response;
  },
};
