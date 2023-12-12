// legacy_hash_id: a_eliYe6
import { axios } from "@pipedream/platform";

export default {
  key: "xero_accounting_api-create-history-note",
  name: "Create History Note",
  description: "Creates a new note adding it to a document.",
  version: "0.1.1",
  type: "action",
  props: {
    xero_accounting_api: {
      type: "app",
      app: "xero_accounting_api",
    },
    tenant_id: {
      type: "string",
      description: "Id of the organization tenant to use on the Xero Accounting API. See [Get Tenant Connections](https://pipedream.com/@sergio/xero-accounting-api-get-tenant-connections-p_OKCzOgn/edit) for a workflow example on how to pull this data.",
    },
    endpoint: {
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
      type: "string",
      description: "Xero identifier of the document to add a history note to.",
    },
    details: {
      type: "string",
      description: "The note to be recorded against a single document. Max Length 250 characters.",
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.xero.com/documentation/api/history-and-notes#PUT

    if (!this.tenant_id || !this.endpoint || !this.guid || !this.details) {
      throw new Error("Must provide tenant_id, endpoint, guid, and details parameters.");
    }

    return await axios($, {
      method: "put",
      url: `https://api.xero.com/api.xro/2.0/${this.endpoint}/${this.guid}/history`,
      headers: {
        "Authorization": `Bearer ${this.xero_accounting_api.$auth.oauth_access_token}`,
        "xero-tenant-id": this.tenant_id,
      },
      data: {
        HistoryRecords: [
          {
            Details: this.details,
          },
        ],
      },
    });
  },
};
