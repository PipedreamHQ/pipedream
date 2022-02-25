// legacy_hash_id: a_K5i58q
import { axios } from "@pipedream/platform";

export default {
  key: "quickbooks-get-purchase",
  name: "Get Purchase",
  description: "Returns info about a purchase.",
  version: "0.1.1",
  type: "action",
  props: {
    quickbooks: {
      type: "app",
      app: "quickbooks",
    },
    purchase_id: {
      type: "string",
      description: "Id of the purchase to get details of.",
    },
    minorversion: {
      type: "string",
      description: "Use the `minorversion` query parameter in REST API requests to access a version of the API other than the generally available version. For example, to invoke minor version 1 of the JournalEntry entity, issue the following request:\n`https://quickbooks.api.intuit.com/v3/company/<realmId>/journalentry/entityId?minorversion=1`",
      optional: true,
    },
  },
  async run({ $ }) {
  //See Quickbooks API docs at: https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/purchase#read-a-purchase

    if (!this.purchase_id) {
      throw new Error("Must provide purchase_id parameter.");
    }

    return await axios($, {
      url: `https://quickbooks.api.intuit.com/v3/company/${this.quickbooks.$auth.company_id}/purchase/${this.purchase_id}`,
      headers: {
        "Authorization": `Bearer ${this.quickbooks.$auth.oauth_access_token}`,
        "content-type": "application/json",
      },
      params: {
        minorversion: this.minorversion,
      },
    });
  },
};
