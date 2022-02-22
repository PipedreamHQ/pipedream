// legacy_hash_id: a_l0i8d0
import { axios } from "@pipedream/platform";

export default {
  key: "quickbooks_sandbox-create-payment",
  name: "Create Bill Payment",
  description: "Creates a bill payment.",
  version: "0.1.1",
  type: "action",
  props: {
    quickbooks_sandbox: {
      type: "app",
      app: "quickbooks_sandbox",
    },
    total_amt: {
      type: "string",
      description: "Indicates the total amount of the associated with this payment. This includes the total of all the payments from the BillPayment Details.",
    },
    vendor_ref_value: {
      type: "string",
      description: "The id of the vendor reference for this transaction.",
    },
    line: {
      type: "any",
      description: "Individual line items representing zero or more `Bill`, `VendorCredit`, and `JournalEntry` objects linked to this BillPayment object.. Valid Line type for create: `LinkedTxnLine`.",
    },
    pay_type: {
      type: "string",
      description: "The payment type. Valid values include: `Check`, `CreditCard`",
      options: [
        "Check",
        "CreditCard",
      ],
    },
    vendor_ref_name: {
      type: "string",
      description: "The name of the vendor reference for this transaction.",
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
    cc_account_ref_value: {
      type: "string",
      description: "The id of the credit card account reference. Required when `PayType` is `CreditCard`. Query the Account name list resource to determine the appropriate Account object for this reference. Use `Account.Id` from that object for `CCAccountRef.value`. The specified account must have `Account.AccountType` set to `Credit Card` and `Account.AccountSubType` set to `CreditCard`. Inject with data only if the payment was transacted through Intuit Payments API.",
      optional: true,
    },
    cc_account_ref_name: {
      type: "string",
      description: "The name of the credit card account reference. Query the Account name list resource to determine the appropriate Account object for this reference. Use `Account.Name` from that object for `CCAccountRef.name`. The specified account must have `Account.AccountType` set to `Credit Card` and `Account.AccountSubType` set to `CreditCard`. Inject with data only if the payment was transacted through Intuit Payments API.",
      optional: true,
    },
    bank_account_ref_value: {
      type: "string",
      description: "The id of the bank account reference. Required when `PayType` is `Check`. Query the Account name list resource to determine the appropriate Account object for this reference. Use `Account.Id` from that object for `APAccountRef.value`. The specified account must have `Account.AccountType` set to `Bank` and `Account.AccountSubType` set to `Checking`.",
      optional: true,
    },
    bank_account_ref_name: {
      type: "string",
      description: "The name of the bank account reference. Query the Account name list resource to determine the appropriate Account object for this reference. Use `Account.Name` from that object for `APAccountRef.name`. The specified account must have `Account.AccountType` set to `Bank` and `Account.AccountSubType` set to `Checking`.",
      optional: true,
    },
    minorversion: {
      type: "string",
      description: "Use the minorversion query parameter in REST API requests to access a version of the API other than the generally available version. For example, to invoke minor version 1 of the JournalEntry entity, issue the following request:\n`https://quickbooks.api.intuit.com/v3/company/<realmId>/journalentry/entityId?minorversion=1`",
      optional: true,
    },
  },
  async run({ $ }) {
  // See Quickbooks API docs at: https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/billpayment#create-a-billpayment

    if (!this.total_amt || !this.vendor_ref_value || !this.line || !this.pay_type) {
      throw new Error("Must provide total_amt, and vendor_ref_value, line, and pay_type parameters.");
    }

    return await axios($, {
      method: "post",
      url: `https://sandbox-quickbooks.api.intuit.com/v3/company/${this.quickbooks_sandbox.$auth.company_id}/billpayment`,
      headers: {
        "Authorization": `Bearer ${this.quickbooks_sandbox.$auth.oauth_access_token}`,
        "accept": "application/json",
        "content-type": "application/json",
      },
      data: {
        TotalAmt: this.total_amt,
        VendorRef: {
          value: this.vendor_ref_value,
          name: this.vendor_ref_name,
        },
        Line: this.line,
        PayType: this.pay_type,
        CurrencyRef: {
          value: this.currency_ref_value,
          name: this.currency_ref_name,
        },
        CreditCardPayment: {
          CCAccountRef: {
            value: this.cc_account_ref_value,
            name: this.cc_account_ref_name,
          },
        },
        CheckPayment: {
          BankAccountRef: {
            value: this.bank_account_ref_value,
            name: this.bank_account_ref_name,
          },
        },
      },
      params: {
        minorversion: this.minorversion,
      },
    });
  },
};
