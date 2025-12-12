import {
  formatLineItems,
  isValidDate,
  removeNullEntries,
} from "../../common/util.mjs";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-create-bill",
  name: "Create Bill",
  description: "Creates a new bill (Accounts Payable)[See the docs here](https://developer.xero.com/documentation/api/accounting/invoices)",
  version: "0.0.5",
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
    invoiceNumber: {
      type: "string",
      optional: true,
      label: "Invoice Number",
      description: "Unique alpha numeric code identifying invoice",
    },
    reference: {
      type: "string",
      optional: true,
      label: "Reference",
      description: "ACCREC only - additional reference number",
    },
    contactId: {
      propDefinition: [
        xeroAccountingApi,
        "contactId",
        (c) => ({
          tenantId: c.tenantId,
        }),
      ],
    },
    lineItems: {
      propDefinition: [
        xeroAccountingApi,
        "lineItems",
      ],
    },
    date: {
      type: "string",
      optional: true,
      label: "Invoice Date",
      description: "Date invoice was issued - YYYY-MM-DD",
    },
    dueDate: {
      type: "string",
      optional: true,
      label: "Invoice Due Date",
      description: "Date invoice is due - YYYY-MM-DD",
    },
    currencyCode: {
      type: "string",
      optional: true,
      label: "The Invoice Currency",
      description:
        "The currency that invoice has been raised in. Refer to [object documentation](https://www.xe.com/iso4217.php)",
    },
  },
  async run({ $ }) {
    const response = await this.xeroAccountingApi.createInvoice({
      $,
      tenantId: this.tenantId,
      data: removeNullEntries({
        Type: "ACCPAY",
        Contact: {
          ContactID: this.contactId,
        },
        LineItems: formatLineItems(this.lineItems),
        Date: isValidDate(this.date, "Date") && this.date,
        DueDate: isValidDate(this.dueDate, "DueDate") && this.dueDate,
        CurrencyCode: this.currencyCode,
        InvoiceNumber: this.invoiceNumber,
        Reference: this.reference,
      }),
    });
    response && $.export("$summary", "Bill successfully created");
    return response;
  },
};
