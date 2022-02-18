// legacy_hash_id: a_l0i8p2
import { axios } from "@pipedream/platform";

export default {
  key: "quickbooks-create-bill",
  name: "Create Bill",
  description: "Creates a bill.",
  version: "0.1.1",
  type: "action",
  props: {
    quickbooks: {
      type: "app",
      app: "quickbooks",
    },
    vendor_ref_value: {
      type: "string",
      description: "Reference to the vendor for this transaction. Query the Vendor name list resource to determine the appropriate Vendor object for this reference. Use Vendor.Id from that object for `VendorRef.value`.",
    },
    line_items: {
      type: "any",
      description: "Individual line items of a transaction. Valid Line types include: ItemBasedExpenseLine` and `AccountBasedExpenseLine`. One minimum line item required for the request to succeed.",
    },
    vendor_ref_name: {
      type: "string",
      description: "Reference to the vendor for this transaction. Query the Vendor name list resource to determine the appropriate Vendor object for this reference. Use `Vendor.Name` from that object for `VendorRef.name`.",
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
  // See Quickbooks API docs at: https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/bill#create-a-bill

    if (!this.vendor_ref_value || !this.line_items) {
      throw new Error("Must provide vendor_ref_value, and line_items parameters.");
    }

    return await axios($, {
      method: "post",
      url: `https://quickbooks.api.intuit.com/v3/company/${this.quickbooks.$auth.company_id}/bill`,
      headers: {
        "Authorization": `Bearer ${this.quickbooks.$auth.oauth_access_token}`,
        "accept": "application/json",
        "content-type": "application/json",
      },
      data: {
        VendorRef: {
          value: this.vendor_ref_value,
          name: this.vendor_ref_name,
        },
        Line: this.line_items,
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
