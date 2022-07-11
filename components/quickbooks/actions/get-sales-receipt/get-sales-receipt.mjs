import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-get-sales-receipt",
  name: "Get Sales Receipt",
  description: "Returns details about a sales receipt. [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/salesreceipt#read-a-salesreceipt)",
  version: "0.1.2",
  type: "action",
  props: {
    quickbooks,
    salesReceiptId: {
      label: "sales Receipt ID",
      type: "string",
      description: "Id of the sales receipt to get details of.",
    },
    minorversion: {
      label: "Minor Version",
      type: "string",
      description: "Use the `minorversion` query parameter in REST API requests to access a version of the API other than the generally available version. For example, to invoke minor version 1 of the JournalEntry entity, issue the following request:\n`https://quickbooks.api.intuit.com/v3/company/<realmId>/journalentry/entityId?minorversion=1`",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.salesReceiptId) {
      throw new ConfigurationError("Must provide salesReceiptId parameter.");
    }

    const response = await this.quickbooks.getBill({
      $,
      salesReceiptId: this.salesReceiptId,
      params: {
        minorversion: this.minorversion,
      },
    });

    if (response) {
      $.export("summary", "Successfully retrieved sales receipt");
    }

    return response;
  },
};
