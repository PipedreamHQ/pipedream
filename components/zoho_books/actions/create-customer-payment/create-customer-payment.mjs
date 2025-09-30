// legacy_hash_id: a_XziR2J
import { PAYMENT_MODE_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import zohoBooks from "../../zoho_books.app.mjs";

export default {
  key: "zoho_books-create-customer-payment",
  name: "Create Customer Payment",
  description: "Creates a new payment. [See the documentation](https://www.zoho.com/books/api/v3/customer-payments/#create-a-payment)",
  version: "0.3.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zohoBooks,
    customerId: {
      propDefinition: [
        zohoBooks,
        "customerId",
      ],
    },
    paymentMode: {
      type: "string",
      label: "Payment Mode",
      description: "Mode through which payment is made.",
      options: PAYMENT_MODE_OPTIONS,
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "Amount paid in the respective payment.",
    },
    date: {
      type: "string",
      label: "Date",
      description: "Date on which payment is made. Format [yyyy-mm-dd]",
    },
    referenceNumber: {
      type: "string",
      label: "Reference Number",
      description: "Reference number generated for the payment. A string of your choice can also be used as the reference number. Max-length [100]",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description about the payment.",
      optional: true,
    },
    invoices: {
      type: "string[]",
      label: "Invoices",
      description: "List of invoice objects associated with the payment. Each invoice object contains `invoice_id`, `invoice_number`, `date`, `invoice_amount`, `amount_applied` and `balance_amount`. **Example: {\"invoice_id\": \"90300000079426\", \"amount_applied\": 450}**",
    },
    exchangeRate: {
      type: "string",
      label: "Exchange Rate",
      description: "Exchange rate for the currency used in the invoices and customer's currency. The payment amount would be the multiplicative product of the original amount and the exchange rate. Default is 1.",
      optional: true,
    },
    bankCharges: {
      type: "string",
      label: "Bank Charges",
      description: "Denotes any additional bank charges.",
      optional: true,
    },
    customFields: {
      propDefinition: [
        zohoBooks,
        "customFields",
      ],
      description: "A list of Additional field objects for the payments. **Example: {\"label\": \"label\", \"value\": 129890}**",
      optional: true,
    },
    invoiceId: {
      propDefinition: [
        zohoBooks,
        "invoiceId",
        ({ customerId }) => ({
          customerId,
        }),
      ],
    },
    amountApplied: {
      type: "string",
      label: "Amount Applied",
      description: "Amount paid for the invoice.",
      optional: true,
    },
    taxAmountWithheld: {
      type: "string",
      label: "Tax Amount Withheld",
      description: "Amount withheld for tax.",
      optional: true,
    },
    accountId: {
      propDefinition: [
        zohoBooks,
        "accountId",
      ],
      optional: true,
    },
    contactPersons: {
      propDefinition: [
        zohoBooks,
        "contactPersons",
        ({ customerId }) => ({
          customerId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.zohoBooks.createCustomerPayment({
      $,
      data: {
        customer_id: this.customerId,
        payment_mode: this.paymentMode,
        amount: this.amount,
        date: this.date,
        reference_number: this.referenceNumber,
        description: this.description,
        invoices: parseObject(this.invoices),
        exchange_rate: this.exchangeRate && parseFloat(this.exchangeRate),
        bank_charges: this.bankCharges && parseFloat(this.bankCharges),
        custom_fields: parseObject(this.customFields),
        invoice_id: this.invoiceId,
        amount_applied: this.amountApplied && parseFloat(this.amountApplied),
        tax_amount_withheld: this.taxAmountWithheld && parseFloat(this.taxAmountWithheld),
        account_id: this.accountId,
        contact_persons: parseObject(this.contactPersons),
      },
    });

    $.export("$summary", `Customer payment successfully created with Id: ${response.payment.payment_id}`);
    return response;
  },
};
