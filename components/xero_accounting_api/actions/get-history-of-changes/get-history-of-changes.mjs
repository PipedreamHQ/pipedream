// legacy_hash_id: a_a4ivAG
import { axios } from "@pipedream/platform";

export default {
  key: "xero_accounting_api-get-history-of-changes",
  name: "Get History of Changes",
  description: "Gets the history of changes to a single existing document.",
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
      type: "string",
      description: "Xero identifier of the document to get history changes of.",
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.xero.com/documentation/api/history-and-notes#GET

    if (!this.tenant_id || !this.endpoint || !this.guid) {
      throw new Error("Must provide tenant_id, endpoint, and guid parameters.");
    }

    return await axios($, {
      url: `https://api.xero.com/api.xro/2.0/${this.endpoint}/${this.guid}/history`,
      headers: {
        "Authorization": `Bearer ${this.xero_accounting_api.$auth.oauth_access_token}`,
        "xero-tenant-id": this.tenant_id,
      },
    });
  },
};
