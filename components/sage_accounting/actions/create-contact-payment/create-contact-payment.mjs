import app from "../../sage_accounting.app.mjs";

export default {
  key: "sage_accounting-create-contact-payment",
  name: "Create Contact Payment",
  description: "Creates a new contact payment in Sage Accounting. [See the documentation](https://developer.sage.com/accounting/reference/payments/#operation/postContactPayments)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    transactionTypeId: {
      propDefinition: [
        app,
        "transactionTypeId",
      ],
    },
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
    bankAccountId: {
      propDefinition: [
        app,
        "bankAccountId",
      ],
    },
    date: {
      propDefinition: [
        app,
        "date",
      ],
    },
    totalAmount: {
      propDefinition: [
        app,
        "totalAmount",
      ],
    },
    paymentMethodId: {
      propDefinition: [
        app,
        "paymentMethodId",
      ],
    },
    netAmount: {
      propDefinition: [
        app,
        "netAmount",
      ],
    },
    taxAmount: {
      propDefinition: [
        app,
        "taxAmount",
      ],
    },
    currencyId: {
      propDefinition: [
        app,
        "currencyId",
      ],
    },
    exchangeRate: {
      propDefinition: [
        app,
        "exchangeRate",
      ],
    },
    baseCurrencyNetAmount: {
      propDefinition: [
        app,
        "baseCurrencyNetAmount",
      ],
    },
    baseCurrencyTaxAmount: {
      propDefinition: [
        app,
        "baseCurrencyTaxAmount",
      ],
    },
    baseCurrencyTotalAmount: {
      propDefinition: [
        app,
        "baseCurrencyTotalAmount",
      ],
    },
    baseCurrencyCurrencyCharge: {
      propDefinition: [
        app,
        "baseCurrencyCurrencyCharge",
      ],
    },
    paymentReference: {
      propDefinition: [
        app,
        "paymentReference",
      ],
    },
    taxRateId: {
      propDefinition: [
        app,
        "taxRateId",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      transaction_type_id: this.transactionTypeId,
      contact_id: this.contactId,
      bank_account_id: this.bankAccountId,
      date: this.date,
      total_amount: parseFloat(this.totalAmount),
      payment_method_id: this.paymentMethodId,
      net_amount: this.netAmount
        ? parseFloat(this.netAmount)
        : undefined,
      tax_amount: this.taxAmount
        ? parseFloat(this.taxAmount)
        : undefined,
      currency_id: this.currencyId,
      exchange_rate: this.exchangeRate
        ? parseFloat(this.exchangeRate)
        : undefined,
      base_currency_net_amount: this.baseCurrencyNetAmount
        ? parseFloat(this.baseCurrencyNetAmount)
        : undefined,
      base_currency_tax_amount: this.baseCurrencyTaxAmount
        ? parseFloat(this.baseCurrencyTaxAmount)
        : undefined,
      base_currency_total_amount: this.baseCurrencyTotalAmount
        ? parseFloat(this.baseCurrencyTotalAmount)
        : undefined,
      base_currency_currency_charge: this.baseCurrencyCurrencyCharge
        ? parseFloat(this.baseCurrencyCurrencyCharge)
        : undefined,
      reference: this.paymentReference,
      tax_rate_id: this.taxRateId,
    };

    const response = await this.app.createContactPayment({
      $,
      data,
    });

    $.export("$summary", `Successfully created contact payment with ID: ${response.id}`);
    return response;
  },
};
