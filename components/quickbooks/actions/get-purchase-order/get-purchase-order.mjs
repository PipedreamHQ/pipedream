import quickbooks from "../../quickbooks.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "quickbooks-get-purchase-order",
  name: "Get Purchase Order",
  description: "Returns details about a purchase order. [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/purchaseorder#read-a-purchase-order)",
  version: "0.1.2",
  type: "action",
  props: {
    quickbooks,
    purchaseOrderId: {
      label: "Purchase Order ID",
      type: "string",
      description: "Id of the purchase order to get details of.",
    },
    minorversion: {
      label: "Minor Version",
      type: "string",
      description: "Use the `minorversion` query parameter in REST API requests to access a version of the API other than the generally available version. For example, to invoke minor version 1 of the JournalEntry entity, issue the following request:\n`https://quickbooks.api.intuit.com/v3/company/<realmId>/journalentry/entityId?minorversion=1`",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.purchaseOrderId) {
      throw new ConfigurationError("Must provide purchaseOrderId parameter.");
    }

    const response = await this.quickbooks.getBill({
      $,
      purchaseOrderId: this.purchaseOrderId,
      params: {
        minorversion: this.minorversion,
      },
    });

    if (response) {
      $.export("summary", "Successfully retrieved purchase order");
    }

    return response;
  },
};
