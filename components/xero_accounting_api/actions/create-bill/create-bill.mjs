import {
  deleteKeys,
  formatLineItems,
  isValidDate,
  removeNullEntries,
} from "../../common/util.mjs";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-create-bill",
  name: "Create Bill",
  description: "Creates a new bill (Accounts Payable)[See the docs here](https://developer.xero.com/documentation/api/accounting/invoices)",
  version: "0.0.3",
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
      label: "Invoice number",
      description: "Unique alpha numeric code identifying invoice",
    },
    reference: {
      type: "string",
      optional: true,
      label: "Reference",
      description: "ACCREC only - additional reference number",
    },
    contact: {
      type: "object",
      label: "Contact information",
      description: `Provide an object. Enter the column name for the key and the corresponding column value. 
      [See object documentation](https://developer.xero.com/documentation/api/accounting/contacts/#post-contacts). 
        Example:
        \`{
            "ContactID":"Existing contact ID. *Note: If contactID is populated, other key-value pairs would be ignored",
            "Name":"MyCorp Inc",
            "FirstName":"Sir",
            "LastName":"Bush",
            "EmailAddress": "jonny@mailinator.com"
        }\``,
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
      label: "Invoice date",
      description: "Date invoice was issued - YYYY-MM-DD",
    },
    dueDate: {
      type: "string",
      optional: true,
      label: "Invoice due date",
      description: "Date invoice is due - YYYY-MM-DD",
    },
    currencyCode: {
      type: "string",
      optional: true,
      label: "The invoice currency",
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
        Contact: this.contact?.ContactID
          ? deleteKeys(this.contact, [
            "Name",
            "FirstName",
            "LastName",
            "EmailAddress",
          ])
          : this.contact,
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
