import { ConfigurationError } from "@pipedream/platform";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-create-bank-transaction",
  name: "Create Bank Transaction",
  description: "Create a new bank transaction [See the documentation](https://developer.xero.com/documentation/api/accounting/banktransactions#put-banktransactions)",
  version: "0.1.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    xeroAccountingApi,
    tenantId: {
      propDefinition: [
        xeroAccountingApi,
        "tenantId",
      ],
    },
    bankAccountCode: {
      type: "string",
      label: "Bank account code",
      description: "The Account Code of the Bank Account of the transaction. If Code is not included then AccountID is required.",
      optional: true,
    },
    bankAccountId: {
      type: "string",
      label: "Bank account ID",
      description: "The ID of the Bank Account transaction. If AccountID is not included then Code is required.",
      optional: true,
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "Id of the contact associated to the bank transaction.",
      optional: true,
    },
    contactName: {
      type: "string",
      label: "Contact name",
      description: "Name of the contact associated to the bank transaction. If there is no contact matching this name, a new contact is created.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
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
    lineItems: {
      type: "object",
      label: "Line items",
      description: "See [LineItems](https://developer.xero.com/documentation/api/banktransactions#LineItemsPOST). The LineItems element can contain any number of individual LineItem sub-elements. At least **one** is required to create a bank transaction.",
    },
    isReconciled: {
      type: "boolean",
      label: "Is reconciled",
      description: "Boolean to show if transaction is reconciled. Conversion related apps can set the IsReconciled flag in scenarios when a matching bank statement line is not available. [Learn more](http://help.xero.com/#Q_BankRecNoImport)",
      optional: true,
    },
    date: {
      type: "string",
      label: "Date",
      description: "Date of transaction - YYYY-MM-DD",
      optional: true,
    },
    reference: {
      type: "string",
      label: "Reference",
      description: "Reference for the transaction. Only supported for SPEND and RECEIVE transactions.",
      optional: true,
    },
    currencyCode: {
      type: "string",
      label: "Currency code",
      description: "The currency that bank transaction has been raised in (see [Currencies](https://developer.xero.com/documentation/api/currencies)). Setting currency is only supported on overpayments.",
      optional: true,
    },
    currencyRate: {
      type: "string",
      label: "Currency rate",
      description: "Exchange rate to base currency when money is spent or received. e.g. 0.7500 Only used for bank transactions in non base currency. If this isn't specified for non base currency accounts then either the user-defined rate (preference) or the [XE.com day rate](http://help.xero.com/#CurrencySettings$Rates) will be used. Setting currency is only supported on overpayments.",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "URL link to a source document - shown as \"Go to App Name\"",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "See [Bank Transaction Status Codes](https://developer.xero.com/documentation/api/types#BankTransactionStatuses)",
      optional: true,
      options: [
        "AUTHORISED",
        "DELETED",
      ],
    },
    lineAmountTypes: {
      type: "string",
      label: "Line amount types",
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
    if (!this.bankAccountCode && !this.bankAccountId) {
      throw new ConfigurationError("Must provide one of **Bank Account Code** or **Bank Account ID** parameters.");
    }
    if (!this.contactId && !this.contactName) {
      throw new ConfigurationError("Must provide one of **Contact ID** or **Contact Name** parameters.");
    }

    const response = await this.xeroAccountingApi.createBankTransaction({
      $,
      tenantId: this.tenantId,
      data: {
        Type: this.type,
        BankAccount: {
          Code: this.bankAccountCode,
          AccountID: this.bankAccountId,
        },
        Contact: {
          ContactID: this.contactId,
          Name: this.contactName,
        },
        IsReconciled: this.isReconciled,
        Date: this.date,
        Reference: this.reference,
        CurrencyCode: this.currencyCode,
        CurrencyRate: this.currencyRate,
        Url: this.url,
        Status: this.status,
        Lineitems: this.lineItems,
        LineAmountTypes: this.lineAmountTypes,
      },
    });

    $.export("$summary", `Successfully created bank transaction with ID: ${response.BankTransactions[0].BankTransactionID}`);
    return response;
  },
};
