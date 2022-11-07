import xeroAccountingApi from "../../xero_accounting_api.app.mjs";
import { removeNullEntries } from "../../common/util.mjs";

export default {
  key: "xero_accounting_api-add-line-item-to-invoice",
  name: "Add Items to Existing Sales Invoice",
  description: "Adds line items to an existing sales invoice. [See the docs here](https://developer.xero.com/documentation/api/accounting/invoices#post-invoices)",
  version: "0.0.2",
  type: "action",
  props: {
    xeroAccountingApi,
    tenantId: {
      propDefinition: [
        xeroAccountingApi,
        "tenantId",
      ],
    },
    invoiceID: {
      type: "string",
      label: "Invoice ID",
      description: "ID of Invoice to be updated",
    },
    lineItems: {
      type: "string[]",
      label: "Line items",
      description: "The LineItems collection can contain any number of individual LineItem sub-elements. At least one is required to create a complete Invoice. [Refer to Tax Type](https://developer.xero.com/documentation/api/accounting/types#report-tax-types), [Refer to Line Items](https://developer.xero.com/documentation/api/accounting/invoices#creating-updating-and-deleting-line-items-when-updating-invoices)\n\n**Example:** `{\"Description\":\"Football\", \"Quantity\":\"20\", \"UnitAmount\":\"50000\", \"TaxType\":\"OUTPUT\" }`",
    },
  },
  async run({ $ }) {
    const {
      tenantId,
      invoiceID,
      lineItems,
    } = this;
    const data = removeNullEntries({
      InvoiceID: invoiceID,
      LineItems: lineItems,
    });
    const response = await this.xeroAccountingApi.createInvoice($, tenantId, data);
    response && $.export("$summary", "Line item created successfully");
    return response;
  },
};
