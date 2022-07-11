import quickbooks from "../../quickbooks.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

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
      throw new ConfigurationError("Must provide customerId parameter.");
    }

    const response = await this.quickbooks.getBill({
      $,
      customerId: this.customerId,
      params: {
        minorversion: this.minorversion,
      },
    });

    if (response) {
      $.export("summary", "Successfully retrieved customer");
    }

    return response;
  },
};
