// legacy_hash_id: a_XziR2J
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_books-create-customer-payment",
  name: "Create Customer Payment",
  description: "Creates a new payment.",
  version: "0.2.1",
  type: "action",
  props: {
    zoho_books: {
      type: "app",
      app: "zoho_books",
    },
    organization_id: {
      type: "string",
      description: "In Zoho Books, your business is termed as an organization. If you have multiple businesses, you simply set each of those up as an individual organization. Each organization is an independent Zoho Books Organization with it's own organization ID, base currency, time zone, language, contacts, reports, etc.\n\nThe parameter `organization_id` should be sent in with every API request to identify the organization.\n\nThe `organization_id` can be obtained from the GET `/organizations` API's JSON response. Alternatively, it can be obtained from the **Manage Organizations** page in the admin console.",
    },
    customer_id: {
      type: "string",
      description: "Customer ID of the customer involved in the payment.",
    },
    payment_mode: {
      type: "string",
      description: "Mode through which payment is made. This can be `check`, `cash`, `creditcard`, `banktransfer`, `bankremittance`, `autotransaction` or `others`. Max-length [100]",
      options: [
        "check",
        "cash",
        "creditcard",
        "banktransfer",
        "bankremittance",
        "autotransaction",
        "others",
      ],
    },
    invoices: {
      type: "any",
      description: "List of invoices associated with the payment. Each invoice object contains `invoice_id`, `invoice_number`, `date`, `invoice_amount`, `amount_applied` and `balance_amount`.",
    },
    amount: {
      type: "string",
      description: "Amount paid in the respective payment.",
    },
    date: {
      type: "string",
      description: "Date on which payment is made. Format [yyyy-mm-dd]",
    },
    reference_number: {
      type: "string",
      description: "Reference number generated for the payment. A string of your choice can also be used as the reference number. Max-length [100]",
      optional: true,
    },
    description: {
      type: "string",
      description: "Description about the payment.",
      optional: true,
    },
    exchange_rate: {
      type: "string",
      description: "Exchange rate for the currency used in the invoices and customer's currency. The payment amount would be the multiplicative product of the original amount and the exchange rate. Default is 1.",
      optional: true,
    },
    bank_charges: {
      type: "string",
      description: "Denotes any additional bank charges.",
      optional: true,
    },
    custom_fields: {
      type: "any",
      description: "Additional fields for the payments.",
      optional: true,
    },
    invoice_id: {
      type: "string",
      description: "ID of the invoice to get payments of.",
      optional: true,
    },
    amount_applied: {
      type: "string",
      description: "Amount paid for the invoice.",
      optional: true,
    },
    tax_amount_withheld: {
      type: "string",
      description: "Amount withheld for tax.",
      optional: true,
    },
    account_id: {
      type: "string",
      description: "ID of the cash/bank account the payment has to be deposited.",
      optional: true,
    },
    contact_persons: {
      type: "string",
      description: "IDs of the contact personsthe thank you mail has to be triggered.",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs: https://www.zoho.com/books/api/v3/#Customer-Payments_Create_a_payment

    if (!this.organization_id || !this.customer_id || !this.payment_mode || !this.invoices || !this.amount || !this.date) {
      throw new Error("Must provide organization_id, customer_id, payment_mode, invoices, amount, and date parameters.");
    }

    return await axios($, {
      method: "post",
      url: `https://books.${this.zoho_books.$auth.base_api_uri}/api/v3/customerpayments?organization_id=${this.organization_id}`,
      headers: {
        Authorization: `Zoho-oauthtoken ${this.zoho_books.$auth.oauth_access_token}`,
      },
      data: {
        customer_id: this.customer_id,
        payment_mode: this.payment_mode,
        amount: this.amount,
        date: this.date,
        reference_number: this.reference_number,
        description: this.description,
        invoices: this.invoices,
        exchange_rate: this.exchange_rate,
        bank_charges: this.bank_charges,
        custom_fields: this.custom_fields,
        invoice_id: this.invoice_id,
        amount_applied: this.amount_applied,
        tax_amount_withheld: this.tax_amount_withheld,
        account_id: this.account_id,
        contact_persons: this.contact_persons,
      },
    });
  },
};
