import { ConfigurationError } from "@pipedream/platform";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-get-history-of-changes",
  name: "Get History of Changes",
  description: "Gets the history of changes to a single existing document.",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    xeroAccountingApi,
    tenantId: {
      propDefinition: [
        xeroAccountingApi,
        "tenantId",
      ],
    },
    endpoint: {
      label: "Endpoint",
      type: "string",
      description: "The URL component, endpoint of the document type to get history changes. See [supported document types](https://developer.xero.com/documentation/api/history-and-notes#SupportedDocs)",
      options: [
        "BankTransactions",
        "BatchPayments",
        "Contacts",
        "CreditNotes",
        "Invoices",
        "Items",
        "ManualJournals",
        "Overpayments",
        "Payments",
        "Prepayments",
        "PurchaseOrders",
        "RepeatingInvoices",
        "Quotes",
      ],
    },
    guid: {
      label: "GUID",
      type: "string",
      description: "Xero identifier of the document to get history changes of.",
    },
  },
  async run({ $ }) {
    if (!this.tenantId || !this.endpoint || !this.guid) {
      throw new ConfigurationError("Must provide **Tenant ID**, **Endpoint**, and **GUID** parameters.");
    }

    const response = await this.xeroAccountingApi.getHistoryOfChanges({
      $,
      endpoint: this.endpoint,
      guid: this.guid,
    });

    $.export("$summary", `History of changes retrieved successfully: ${this.guid}`);
    return response;
  },
};
