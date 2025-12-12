import { ConfigurationError } from "@pipedream/platform";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-create-payment",
  name: "Create Payment",
  description: "Creates a new payment",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
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
    accountId: {
      label: "Account ID",
      type: "string",
      description: "ID of account you are using to make the payment e.g. 294b1dc5-cc47-2afc-7ec8-64990b8761b8. This account needs to be either an account of type BANK or have enable payments to this accounts switched on (see [GET Accounts](https://developer.xero.com/documentation/api/Accounts)) . See the edit account screen of your Chart of Accounts in Xero if you wish to enable payments for an account other than a bank account",
      optional: true,
    },
    accountCode: {
      label: "Account Code",
      type: "string",
      description: "Code of account you are using to make the payment e.g. 001 ( note: *not all accounts have a code value*)",
      optional: true,
    },
    invoiceId: {
      label: "Invoice ID",
      type: "string",
      description: "ID of the invoice you are applying payment to e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9",
      optional: true,
    },
    creditNoteId: {
      label: "Credit Note ID",
      type: "string",
      description: "ID of the credit note you are applying payment to e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9",
      optional: true,
    },
    prepaymentId: {
      label: "Prepayment ID",
      type: "string",
      description: "ID of the prepayment you are applying payment to e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9",
      optional: true,
    },
    overpaymentId: {
      label: "Overpayment ID",
      type: "string",
      description: "ID of the overpayment you are applying payment to e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9",
      optional: true,
    },
    invoiceNumber: {
      label: "Invoice Number",
      type: "string",
      description: "Number of invoice you are applying payment to e.g. INV-4003",
      optional: true,
    },
    creditNoteNumber: {
      label: "Credit Note Number",
      type: "string",
      description: "Number of credit note you are applying payment to e.g. INV-4003",
      optional: true,
    },
    date: {
      label: "Date",
      type: "string",
      description: "Date the payment is being made (YYYY-MM-DD) e.g. 2009-09-06",
      optional: true,
    },
    currencyRate: {
      label: "Currency Rate",
      type: "string",
      description: "Exchange rate when payment is received. Only used for non base currency invoices and credit notes e.g. 0.7500",
      optional: true,
    },
    amount: {
      label: "Amount",
      type: "string",
      description: "The amount of the payment. Must be less than or equal to the outstanding amount owing on the invoice e.g. 200.00",
      optional: true,
    },
    reference: {
      label: "Reference",
      type: "string",
      description: "An optional description for the payment e.g. Direct Debit",
      optional: true,
    },
    isReconciled: {
      label: "Is Reconciled",
      type: "boolean",
      description: "A boolean indicating whether the payment has been reconciled.",
      optional: true,
    },
    status: {
      label: "Status",
      type: "string",
      description: "The [status](https://developer.xero.com/documentation/api/types#PaymentStatusCodes) of the payment.",
      optional: true,
    },
  },
  async run({ $ }) {
    if ((!this.accountId && !this.accountCode) ||
    (!this.invoiceId &&
    !this.creditNoteId &&
    !this.prepaymentId &&
    !this.overpaymentId &&
    !this.invoiceNumber &&
    !this.creditNoteNumber) ||
    !this.tenantId) {
      throw new ConfigurationError("Must provide **Account ID** or **Account Code**, and", "\n", "**Invoice ID** or **Credit Note ID** or **Prepayment ID** or **Overpayment ID** or **Invoice Number** or **Credit Note Number**,\nand **Tenant ID** parameters.");
    }

    const data = {
      Date: this.date,
      CurrencyRate: this.currencyRate,
      Amount: this.amount,
      Reference: this.reference,
      IsReconciled: this.isReconciled,
      Status: this.status,
    };

    if (this.accountId) {
      data["Account"] = {
        AccountID: this.accountId,
      };
    } else {
      data["Account"] = {
        Code: this.account_code,
      };
    }

    if (this.invoiceId) {
      data["Invoice"] = {
        InvoiceID: this.invoiceId,
      };
    } else if (this.creditNoteId) {
      data["CreditNote"] = {
        CreditNoteID: this.creditNoteId,
      };
    } else if (this.prepaymentId) {
      data["Prepayment"] = {
        PrepaymentID: this.prepaymentId,
      };
    } else if (this.overpaymentId) {
      data["Overpayment"] = {
        OverpaymentID: this.overpaymentId,
      };
    } else if (this.invoiceNumber) {
      data["Invoice"] = {
        InvoiceNumber: this.invoiceNumber,
      };
    } else if (this.creditNoteNumber) {
      data["CreditNote"] = {
        CreditNoteNumber: this.creditNoteNumber,
      };
    }

    const response = await this.xeroAccountingApi.createPayment({
      $,
      tenantId: this.tenantId,
      data,
    });

    $.export("$summary", `Successfully created payment with reference: ${this.reference}`);
    return response;
  },
};
