import { ConfigurationError } from "@pipedream/platform";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-create-history-note",
  name: "Create History Note",
  description: "Creates a new note adding it to a document.",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
      description: "The URL component, endpoint of the document type to add the history note. See [supported document types](https://developer.xero.com/documentation/api/history-and-notes#SupportedDocs)",
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
      description: "Xero identifier of the document to add a history note to.",
    },
    details: {
      type: "string",
      label: "Details",
      description: "The note to be recorded against a single document. Max Length 250 characters.",
    },
  },
  async run({ $ }) {
    if (!this.tenantId || !this.endpoint || !this.guid || !this.details) {
      throw new ConfigurationError("Must provide **Tenant ID**, **Endpoint**, **GUID**, and **Details** parameters.");
    }

    const response = await this.xeroAccountingApi.createHistoryNote({
      $,
      tenantId: this.tenantId,
      endpoint: this.endpoint,
      guid: this.guid,
      data: {
        HistoryRecords: [
          {
            Details: this.details,
          },
        ],
      },
    });

    $.export("$summary", `Successfully created history note for ${this.endpoint} with ID: ${this.guid}`);
    return response;
  },
};
