import economic from "../../e_conomic.app.mjs";

export default {
  key: "e_conomic-create-voucher",
  name: "Create Voucher",
  description: "Creates a new voucher. [See the documentation](https://restdocs.e-conomic.com/#get-journals-journalnumber-vouchers)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    economic,
    journalNumber: {
      propDefinition: [
        economic,
        "journalNumber",
      ],
    },
    accountingYear: {
      type: "string",
      label: "Accounting Year",
      description: "The accounting year of the voucher",
    },
    customerPaymentAmount: {
      type: "string",
      label: "Customer Payment Amount",
      description: "The amount of the customer payment",
    },
    customerPaymentDate: {
      type: "string",
      label: "Customer Payment Date",
      description: "The date of the customer payment",
    },
    financeVoucherAmount: {
      type: "string",
      label: "Finance Voucher Amount",
      description: "The amount of the finance voucher",
    },
    financeVoucherDate: {
      type: "string",
      label: "Finance Voucher Date",
      description: "The date of the finance voucher",
    },
    manualCustomerInvoiceAmount: {
      type: "string",
      label: "Manual Customer Invoice Amount",
      description: "The amount of the manual customer invoice",
    },
    manualCustomerInvoiceDate: {
      type: "string",
      label: "Manual Customer Invoice Date",
      description: "The date of the manual customer invoice",
    },
    supplierInvoiceAmount: {
      type: "string",
      label: "Supplier Invoice Amount",
      description: "The amount of the supplier invoice",
    },
    supplierInvoiceDate: {
      type: "string",
      label: "Supplier Invoice Date",
      description: "The date of the supplier invoice",
    },
    supplierPaymentAmount: {
      type: "string",
      label: "Supplier Payment Amount",
      description: "The amount of the supplier payment",
    },
    supplierPaymentDate: {
      type: "string",
      label: "Supplier Payment Date",
      description: "The date of the supplier payment",
    },
    supplierNumber: {
      propDefinition: [
        economic,
        "supplierNumber",
      ],
      optional: true,
    },
    customerNumber: {
      propDefinition: [
        economic,
        "customerNumber",
      ],
      optional: true,
    },
    currencyCode: {
      propDefinition: [
        economic,
        "currencyCode",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.economic.createVoucher({
      $,
      journalNumber: this.journalNumber,
      data: {
        accountingYear: {
          year: this.accountingYear,
        },
        entries: {
          customerPayments: [
            {
              amount: this.customerPaymentAmount,
              date: this.customerPaymentDate,
              customer: this.customerNumber
                ? {
                  customerNumber: this.customerNumber,
                }
                : undefined,
              currency: this.currencyCode
                ? {
                  code: this.currencyCode,
                }
                : undefined,
            },
          ],
          financeVouchers: [
            {
              amount: this.financeVoucherAmount,
              date: this.financeVoucherDate,
              currency: this.currencyCode
                ? {
                  code: this.currencyCode,
                }
                : undefined,
            },
          ],
          manualCustomerInvoices: [
            {
              amount: this.manualCustomerInvoiceAmount,
              date: this.manualCustomerInvoiceDate,
              customer: this.customerNumber
                ? {
                  customerNumber: this.customerNumber,
                }
                : undefined,
              currency: this.currencyCode
                ? {
                  code: this.currencyCode,
                }
                : undefined,
            },
          ],
          supplierInvoices: [
            {
              amount: this.supplierInvoiceAmount,
              date: this.supplierInvoiceDate,
              supplier: this.supplierNumber
                ? {
                  supplierNumber: this.supplierNumber,
                }
                : undefined,
              currency: this.currencyCode
                ? {
                  code: this.currencyCode,
                }
                : undefined,
            },
          ],
          supplierPayments: [
            {
              amount: this.supplierPaymentAmount,
              date: this.supplierPaymentDate,
              supplier: this.supplierNumber
                ? {
                  supplierNumber: this.supplierNumber,
                }
                : undefined,
              currency: this.currencyCode
                ? {
                  code: this.currencyCode,
                }
                : undefined,
            },
          ],
        },
      },
    });
    $.export("$summary", "Successfully created voucher.");
    return response;
  },
};
