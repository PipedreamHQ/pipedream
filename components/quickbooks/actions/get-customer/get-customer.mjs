import quickbooks from "../../quickbooks.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "quickbooks-get-customer",
  name: "Get Customer",
  description: "Returns info about a customer. [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/most-commonly-used/customer#read-a-customer)",
  version: "0.3.2",
  type: "action",
  props: {
    quickbooks,
    customerId: {
      label: "Customer ID",
      type: "string",
      description: "Id of the account to get details of.",
    },
    minorversion: {
      label: "Minor Version",
      type: "string",
      description: "Use the `minorversion` query parameter in REST API requests to access a version of the API other than the generally available version. For example, to invoke minor version 1 of the JournalEntry entity, issue the following request:\n`https://quickbooks.api.intuit.com/v3/company/<realmId>/journalentry/entityId?minorversion=1`",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.customerId) {
      throw new Error("Must provide customerId parameter.");
    }

    return await axios($, {
      url: `https://quickbooks.api.intuit.com/v3/company/${this.quickbooks.$auth.company_id}/customer/${this.customerId}`,
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
