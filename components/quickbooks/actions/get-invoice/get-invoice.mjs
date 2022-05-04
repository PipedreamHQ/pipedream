// legacy_hash_id: a_A6i564
import { axios } from "@pipedream/platform";

export default {
  key: "quickbooks-get-invoice",
  name: "Get Invoice",
  description: "Returns info about an invoice.",
  version: "0.2.1",
  type: "action",
  props: {
    quickbooks: {
      type: "app",
      app: "quickbooks",
    },
    invoice_id: {
      type: "string",
      description: "Id of the invoice to get details of.",
      optional: true,
    },
    minorversion: {
      type: "string",
      description: "Use the `minorversion` query parameter in REST API requests to access a version of the API other than the generally available version. For example, to invoke minor version 1 of the JournalEntry entity, issue the following request:\n`https://quickbooks.api.intuit.com/v3/company/<realmId>/journalentry/entityId?minorversion=1`",
      optional: true,
    },
  },
  async run({ $ }) {
  // See Quickbooks API docs at: https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice#read-an-invoice

    if (!this.invoice_id) {
      throw new Error("Must provide invoice_id parameter.");
    }

    return await axios($, {
      url: `https://sandbox.api.intuit.com/v3/company/${this.quickbooks.$auth.company_id}/invoice/${this.invoice_id}`,
      headers: {
        "Authorization": `Bearer ${this.quickbooks.$auth.oauth_access_token}`,
        "accept": "application/json",
        "content-type": "application/json",
      },
      params: {
        minorversion: this.minorversion,
      },
    });
  },
};
