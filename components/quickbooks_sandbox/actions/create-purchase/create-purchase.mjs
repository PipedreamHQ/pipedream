// legacy_hash_id: a_G1iL4w
import { axios } from "@pipedream/platform";

export default {
  key: "quickbooks_sandbox-create-purchase",
  name: "Create Purchase",
  description: "Creates a purchase.",
  version: "0.1.1",
  type: "action",
  props: {
    quickbooks_sandbox: {
      type: "app",
      app: "quickbooks_sandbox",
    },
    line_items: {
      type: "any",
      description: "Individual line items of a transaction. Valid `Line` type for create: `AccountBasedExpenseLine`",
    },
    account_ref_value: {
      type: "string",
      description: "Specifies the id of the account reference. Check must specify bank account, CreditCard must specify credit card account. Validation Rules:Valid and Active Account Reference of an appropriate type.",
    },
    payment_type: {
      type: "string",
      description: "Payment Type can be: `Cash`, `Check`, or `CreditCard`.",
      options: [
        "Cash",
        "Check",
        "CreditCard",
      ],
    },
    account_ref_name: {
      type: "string",
      description: "Specifies the name of the account reference. Check must specify bank account, CreditCard must specify credit card account. Validation Rules:Valid and Active Account Reference of an appropriate type.",
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

    if (!this.line_items || !this.account_ref_value) {
      throw new Error("Must provide line_items, and account_ref_value parameters.");
    }

    return await axios($, {
      method: "post",
      url: `https://sandbox-quickbooks.api.intuit.com/v3/company/${this.quickbooks_sandbox.$auth.company_id}/purchase`,
      headers: {
        "Authorization": `Bearer ${this.quickbooks_sandbox.$auth.oauth_access_token}`,
        "accept": "application/json",
        "content-type": "application/json",
      },
      data: {
        PaymentType: this.payment_type,
        AccountRef: {
          value: this.account_ref_value,
          name: this.account_ref_name,
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
