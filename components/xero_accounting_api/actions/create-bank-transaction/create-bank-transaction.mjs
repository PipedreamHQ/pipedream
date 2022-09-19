// legacy_hash_id: a_WYiwz2
import { axios } from "@pipedream/platform";

export default {
  key: "xero_accounting_api-create-bank-transaction",
  name: "Create Bank Transaction",
  version: "0.1.1",
  type: "action",
  props: {
    xero_accounting_api: {
      type: "app",
      app: "xero_accounting_api",
    },
    bank_account_code: {
      type: "string",
      description: "The Account Code of the Bank Account of the transaction. If Code is not included then AccountID is required.",
      optional: true,
    },
    bank_account_id: {
      type: "string",
      description: "The ID of the Bank Account transaction. If AccountID is not included then Code is required.",
      optional: true,
    },
    contact_id: {
      type: "string",
      description: "Id of the contact associated to the bank transaction.",
      optional: true,
    },
    contact_name: {
      type: "string",
      description: "Name of the contact associated to the bank transaction. If there is no contact matching this name, a new contact is created.",
      optional: true,
    },
    tenant_id: {
      type: "string",
      description: "Id of the organization tenant to use on the Xero Accounting API. See [Get Tenant Connections](https://pipedream.com/@sergio/xero-accounting-api-get-tenant-connections-p_OKCzOgn/edit) for a workflow example on how to pull this data.",
    },
    type: {
      type: "string",
      description: "See [Bank Transaction Types](https://developer.xero.com/documentation/api/types#BankTransactionTypes)",
      options: [
        "RECEIVE",
        "RECEIVE-OVERPAYMENT",
        "RECEIVE-PREPAYMENT",
        "SPEND",
        "SPEND-OVERPAYMENT",
        "SPEND-PREPAYMENT",
      ],
    },
    line_items: {
      type: "object",
      description: "See [LineItems](https://developer.xero.com/documentation/api/banktransactions#LineItemsPOST). The LineItems element can contain any number of individual LineItem sub-elements. At least **one** is required to create a bank transaction.",
    },
    is_reonciled: {
      type: "boolean",
      description: "Boolean to show if transaction is reconciled. Conversion related apps can set the IsReconciled flag in scenarios when a matching bank statement line is not available. [Learn more](http://help.xero.com/#Q_BankRecNoImport)",
      optional: true,
    },
    date: {
      type: "string",
      description: "Date of transaction - YYYY-MM-DD",
      optional: true,
    },
    reference: {
      type: "string",
      description: "Reference for the transaction. Only supported for SPEND and RECEIVE transactions.",
      optional: true,
    },
    currency_code: {
      type: "string",
      description: "The currency that bank transaction has been raised in (see [Currencies](https://developer.xero.com/documentation/api/currencies)). Setting currency is only supported on overpayments.",
      optional: true,
    },
    currency_rate: {
      type: "string",
      description: "Exchange rate to base currency when money is spent or received. e.g. 0.7500 Only used for bank transactions in non base currency. If this isn't specified for non base currency accounts then either the user-defined rate (preference) or the [XE.com day rate](http://help.xero.com/#CurrencySettings$Rates) will be used. Setting currency is only supported on overpayments.",
      optional: true,
    },
    url: {
      type: "string",
      description: "URL link to a source document - shown as \"Go to App Name\"",
      optional: true,
    },
    status: {
      type: "string",
      description: "See [Bank Transaction Status Codes](https://developer.xero.com/documentation/api/types#BankTransactionStatuses)",
      optional: true,
      options: [
        "AUTHORISED",
        "DELETED",
      ],
    },
    line_amount_types: {
      type: "string",
      description: "Line amounts are exclusive of tax by default if you don't specify this element. See [Line Amount Types](https://developer.xero.com/documentation/api/types#LineAmountTypes)",
      optional: true,
      options: [
        "Exclusive",
        "Inclusive",
        "NoTax",
      ],
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.xero.com/documentation/api/banktransactions#PUT

    if ((!this.bank_account_code && !this.bank_account_id)
    || (!this.contact_id && !this.contact_name)
    || !this.tenant_id || !this.type || !this.line_items) {
      throw new Error("Must provide one of bank_account_code or bank_account_id, contact_id or contact_name, tenant_id, type, and line_items parameters.");
    }

    return await axios($, {
      method: "put",
      url: "https://api.xero.com/api.xro/2.0/BankTransactions",
      headers: {
        "Authorization": `Bearer ${this.xero_accounting_api.$auth.oauth_access_token}`,
        "xero-tenant-id": this.tenant_id,
      },
      data: {
        Type: this.type,
        BankAccount: {
          Code: this.bank_account_code,
          AccountID: this.bank_account_id,
        },
        Contact: {
          ContactID: this.contact_id,
          Name: this.contact_name,
        },
        IsReconciled: this.is_reonciled,
        Date: this.date,
        Reference: this.reference,
        CurrencyCode: this.currency_code,
        CurrencyRate: this.currency_rate,
        Url: this.url,
        Status: this.status,
        Lineitems: this.line_items,
        LineAmountTypes: this.line_amount_types,
      },
    });
  },
};
