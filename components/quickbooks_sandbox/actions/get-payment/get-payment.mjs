// legacy_hash_id: a_0Mi7LY
import { axios } from "@pipedream/platform";

export default {
  key: "quickbooks_sandbox-get-payment",
  name: "Get Payment",
  description: "Returns info about a payment.",
  version: "0.1.1",
  type: "action",
  props: {
    quickbooks_sandbox: {
      type: "app",
      app: "quickbooks_sandbox",
    },
    payment_id: {
      type: "string",
      description: "Id of the item to get details of.",
    },
    minorversion: {
      type: "string",
      description: "Use the `minorversion` query parameter in REST API requests to access a version of the API other than the generally available version. For example, to invoke minor version 1 of the JournalEntry entity, issue the following request:\n`https://quickbooks.api.intuit.com/v3/company/<realmId>/journalentry/entityId?minorversion=1`",
      optional: true,
    },
  },
  async run({ $ }) {
  //See Quickbooks API docs at: https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/payment#read-a-payment

    if (!this.payment_id) {
      throw new Error("Must provide payment_id parameter.");
    }

    return await axios($, {
      url: `https://sandbox-quickbooks.api.intuit.com/v3/company/${this.quickbooks_sandbox.$auth.company_id}/payment/${this.payment_id}`,
      headers: {
        "Authorization": `Bearer ${this.quickbooks_sandbox.$auth.oauth_access_token}`,
        "content-type": "application/json",
      },
      params: {
        minorversion: this.minorversion,
      },
    });
  },
};
