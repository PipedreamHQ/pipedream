import {
  formatArrayStrings,
  removeNullEntries,
  deleteKeys,
  isValidDate,
} from "../../common/util.mjs";
import constant from "../../common/constants.mjs";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-create-bill",
  name: "Create Bill",
  description:
    "Creates a new bill (Accounts Payable)[See the docs here](https://developer.xero.com/documentation/api/accounting/invoices)",
  version: "0.0.1",
  type: "action",
  props: {
    xeroAccountingApi,
    tenantId: {
      propDefinition: [
        xeroAccountingApi,
        "tenantId",
      ],
    },
    InvoiceNumber: {
      type: "string",
      optional: true,
      label: "Invoice number",
      description: "Unique alpha numeric code identifying invoice",
    },
    Reference: {
      type: "string",
      optional: true,
      label: "Reference",
      description: "ACCREC only - additional reference number",
    },
    Contact: {
      type: "object",
      label: "Contact information",
      description: `Provide an object. Enter the column name for the key and the corresponding column value. 
      [See object documentation](https://developer.xero.com/documentation/api/accounting/contacts/#post-contacts). 
        Example:
        \`{
            "ContactID":"Existing contact ID. *Note: If contactID is populated, other key-value pairs would be ignored",
            "Name":"Tmann Inc",
            "FirstName":"Sir",
            "LastName":"Bush",
            "EmailAddress": "jonny@mailinator.com"
        }\``,
    },
    LineItems: {
      type: "string[]",
      label: "Line items",
      description: `Provide multiple items using the example below. At least one is required to create a complete Invoice. 
        Example:
        \`{
            "Description":"Football",
            "Quantity":"20",
            "UnitAmount":"50000",
            "TaxType":"Refer to https://developer.xero.com/documentation/api/accounting/types#report-tax-types",
        }\``,
    },
    Date: {
      type: "string",
      optional: true,
      label: "Invoice date",
      description: "Date invoice was issued - YYYY-MM-DD",
    },
    DueDate: {
      type: "string",
      optional: true,
      label: "Invoice due date",
      description: "Date invoice is due - YYYY-MM-DD",
    },
    CurrencyCode: {
      type: "string",
      optional: true,
      label: "The invoice currency",
      description:
        "The currency that invoice has been raised in. Refer to [object documentation](https://www.xe.com/iso4217.php)",
    },
  },
  async run({ $ }) {
    const {
      tenantId,
      Contact,
      InvoiceNumber,
      Reference,
      LineItems,
      Date,
      DueDate,
      CurrencyCode,
    } = this;
    const data = removeNullEntries({
      Type: "ACCPAY",
      Contact: Contact?.ContactID
        ? deleteKeys(Contact, [
          "Name",
          "FirstName",
          "LastName",
          "EmailAddress",
        ])
        : Contact,
      LineItems: formatArrayStrings(
        LineItems,
        constant.ALLOWED_LINEITEMS_KEYS,
        "LineItems",
      ),
      Date: isValidDate(Date, "Date") && Date,
      DueDate: isValidDate(DueDate, "DueDate") && DueDate,
      CurrencyCode,
      InvoiceNumber,
      Reference,
    });
    const response = await this.xeroAccountingApi.createInvoice($, tenantId, data);
    response && $.export("$summary", "Bill successfully created");
    return response;
  },
};
