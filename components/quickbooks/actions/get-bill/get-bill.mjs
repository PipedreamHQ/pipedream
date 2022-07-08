import quickbooks from "../../quickbooks.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "quickbooks-get-bill",
  name: "Get Bill",
  description: "Returns info about a bill. [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/bill#read-a-bill)",
  version: "0.1.2",
  type: "action",
  props: {
    quickbooks,
    billId: {
      label: "Bill ID",
      type: "string",
      description: "Id of the bill to get details of.",
    },
    minorversion: {
      label: "Minor Version",
      type: "string",
      description: "Use the `minorversion` query parameter in REST API requests to access a version of the API other than the generally available version. For example, to invoke minor version 1 of the JournalEntry entity, issue the following request:\n`https://quickbooks.api.intuit.com/v3/company/<realmId>/journalentry/entityId?minorversion=1`",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.billId) {
      throw new Error("Must provide billId parameter.");
    }

    return await axios($, {
      url: `https://quickbooks.api.intuit.com/v3/company/${this.quickbooks.$auth.company_id}/bill/${this.billId}`,
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
