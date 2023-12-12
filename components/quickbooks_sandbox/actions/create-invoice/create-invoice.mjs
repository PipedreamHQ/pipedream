// legacy_hash_id: a_gniWe7
import { axios } from "@pipedream/platform";

export default {
  key: "quickbooks_sandbox-create-invoice",
  name: "Create Invoice",
  description: "Creates an invoice.",
  version: "0.1.1",
  type: "action",
  props: {
    quickbooks_sandbox: {
      type: "app",
      app: "quickbooks_sandbox",
    },
    line_items: {
      type: "any",
      description: "The minimum line item required for the request is one of the following: \n* `SalesItemLine` type\n* `GroupLine` type\nand Inline subtotal using `DescriptionOnlyLine`",
    },
    customer_ref_value: {
      type: "string",
      description: "Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use `Customer.Id` from that object for `CustomerRef.value`.",
    },
    customer_ref_name: {
      type: "string",
      description: "Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use `Customer.DisplayName ` from that object for `CustomerRef.name`.",
      optional: true,
    },
    currency_ref_value: {
      type: "string",
      description: "A three letter string representing the ISO 4217 code for the currency. For example, `USD`, `AUD`, `EUR`, and so on. This must be defined if multicurrency is enabled for the company.\nMulticurrency is enabled for the company if `Preferences.MultiCurrencyEnabled` is set to `true`. Read more about multicurrency support [here](https://developer.intuit.com/docs?RedirectID=MultCurrencies). Required if multicurrency is enabled for the company.",
      optional: true,
    },
    currency_ref_name: {
      type: "object",
      description: "The full name of the currency.",
      optional: true,
    },
    minorversion: {
      type: "string",
      description: "Use the minorversion query parameter in REST API requests to access a version of the API other than the generally available version. For example, to invoke minor version 1 of the JournalEntry entity, issue the following request:\n`https://quickbooks.api.intuit.com/v3/company/<realmId>/journalentry/entityId?minorversion=1`",
      optional: true,
    },
  },
  async run({ $ }) {
  // See Quickbooks API docs at: https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice#create-an-invoice

    if (!this.line_items || !this.customer_ref_value) {
      throw new Error("Must provide line_items, and customer_ref_value parameters.");
    }

    return await axios($, {
      method: "post",
      url: `https://sandbox-quickbooks.api.intuit.com/v3/company/${this.quickbooks_sandbox.$auth.company_id}/invoice`,
      headers: {
        "Authorization": `Bearer ${this.quickbooks_sandbox.$auth.oauth_access_token}`,
        "accept": "application/json",
        "content-type": "application/json",
      },
      data: {
        Line: this.line_items,
        CustomerRef: {
          value: this.customer_ref_value,
          name: this.customer_ref_name,
        },
        CurrencyRef: {
          value: this.currency_ref_value,
          name: this.currency_ref_name,
        },
      },
      params: {
        minorversion: this.minorversion,
      },
    });
  },
};
