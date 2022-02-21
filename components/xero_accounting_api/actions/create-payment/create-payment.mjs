// legacy_hash_id: a_k6irV0
import { axios } from "@pipedream/platform";

export default {
  key: "xero_accounting_api-create-payment",
  name: "Create Payment",
  description: "Creates a new payment",
  version: "0.1.1",
  type: "action",
  props: {
    xero_accounting_api: {
      type: "app",
      app: "xero_accounting_api",
    },
    account_id: {
      type: "string",
      description: "ID of account you are using to make the payment e.g. 294b1dc5-cc47-2afc-7ec8-64990b8761b8. This account needs to be either an account of type BANK or have enable payments to this accounts switched on (see [GET Accounts](https://developer.xero.com/documentation/api/Accounts)) . See the edit account screen of your Chart of Accounts in Xero if you wish to enable payments for an account other than a bank account",
      optional: true,
    },
    account_code: {
      type: "string",
      description: "Code of account you are using to make the payment e.g. 001 ( note: *not all accounts have a code value*)",
      optional: true,
    },
    invoice_id: {
      type: "string",
      description: "ID of the invoice you are applying payment to e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9",
      optional: true,
    },
    credit_note_id: {
      type: "string",
      description: "ID of the credit note you are applying payment to e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9",
      optional: true,
    },
    prepayment_id: {
      type: "string",
      description: "ID of the prepayment you are applying payment to e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9",
      optional: true,
    },
    overpayment_id: {
      type: "string",
      description: "ID of the overpayment you are applying payment to e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9",
      optional: true,
    },
    invoice_number: {
      type: "string",
      description: "Number of invoice you are applying payment to e.g. INV-4003",
      optional: true,
    },
    credit_note_number: {
      type: "string",
      description: "Number of credit note you are applying payment to e.g. INV-4003",
      optional: true,
    },
    tenant_id: {
      type: "string",
      description: "Id of the organization tenant to use on the Xero Accounting API. See [Get Tenant Connections](https://pipedream.com/@sergio/xero-accounting-api-get-tenant-connections-p_OKCzOgn/edit) for a workflow example on how to pull this data.",
    },
    date: {
      type: "string",
      description: "Date the payment is being made (YYYY-MM-DD) e.g. 2009-09-06",
      optional: true,
    },
    currency_rate: {
      type: "string",
      description: "Exchange rate when payment is received. Only used for non base currency invoices and credit notes e.g. 0.7500",
      optional: true,
    },
    amount: {
      type: "string",
      description: "The amount of the payment. Must be less than or equal to the outstanding amount owing on the invoice e.g. 200.00",
      optional: true,
    },
    reference: {
      type: "string",
      description: "An optional description for the payment e.g. Direct Debit",
      optional: true,
    },
    is_reconciled: {
      type: "boolean",
      description: "A boolean indicating whether the payment has been reconciled.",
      optional: true,
    },
    status: {
      type: "string",
      description: "The [status](https://developer.xero.com/documentation/api/types#PaymentStatusCodes) of the payment.",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.xero.com/documentation/api/payments#PUT

    if ((!this.account_id && !this.account_code)
      || (!this.invoice_id && !this.credit_note_id && !this.prepayment_id && !this.overpayment_id && !this.invoice_number && !this.credit_note_number)
      || !this.tenant_id) {
      throw new Error("Must provide account_id or account_code, and", "\n", "invoice_id or credit_note_id or prepayment_id or overpayment_id or invoice_number or credit_note_number,\nand tenant_id parameters.");
    }

    //Adds parameters to the requests body
    var data = {
      Date: this.date,
      CurrencyRate: this.currency_rate,
      Amount: this.amount,
      Reference: this.reference,
      IsReconciled: this.is_reconciled,
      Status: this.status,
    };

    //Adds the account paramter to the request body
    if (this.account_id) {
      data["Account"] = {
        AccountID: this.account_id,
      };
    } else {
      data["Account"] = {
        Code: this.account_code,
      };
    }

    //Adds the related document object where payment is applied to the request body
    if (this.invoice_id) {
      data["Invoice"] = {
        InvoiceID: this.invoice_id,
      };
    } else if (this.credit_note_id) {
      data["CreditNote"] = {
        CreditNoteID: this.credit_note_id,
      };
    } else if (this.prepayment_id) {
      data["Prepayment"] = {
        PrepaymentID: this.prepayment_id,
      };
    } else if (this.overpayment_id) {
      data["Overpayment"] = {
        OverpaymentID: this.overpayment_id,
      };
    } else if (this.invoice_number) {
      data["Invoice"] = {
        InvoiceNumber: this.invoice_number,
      };
    } else if (this.credit_note_number) {
      data["CreditNote"] = {
        CreditNoteNumber: this.credit_note_number,
      };
    }

    //Sends the request against Xero Accounting API
    return await axios($, {
      method: "put",
      url: "https://api.xero.com/api.xro/2.0/Payments",
      headers: {
        "Authorization": `Bearer ${this.xero_accounting_api.$auth.oauth_access_token}`,
        "xero-tenant-id": this.tenant_id,
      },
      data,
    });
  },
};
