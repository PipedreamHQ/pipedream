import quickbooks from "../../quickbooks.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "quickbooks-get-invoice",
  name: "Get Invoice",
  description: "Returns info about an invoice. [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice#read-an-invoice)",
  version: "0.2.2",
  type: "action",
  props: {
    quickbooks,
    invoiceId: {
      label: "Invoice ID",
      type: "string",
      description: "Id of the invoice to get details of.",
      optional: true,
    },
    minorversion: {
      label: "Minor Version",
      type: "string",
      description: "Use the `minorversion` query parameter in REST API requests to access a version of the API other than the generally available version. For example, to invoke minor version 1 of the JournalEntry entity, issue the following request:\n`https://quickbooks.api.intuit.com/v3/company/<realmId>/journalentry/entityId?minorversion=1`",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.invoiceId) {
      throw new ConfigurationError("Must provide invoiceId parameter.");
    }

    const response = await this.quickbooks.getBill({
      $,
      invoiceId: this.invoiceId,
      params: {
        minorversion: this.minorversion,
      },
    });

    if (response) {
      $.export("summary", "Successfully retrieved invoice");
    }

    return response;
  },
};
