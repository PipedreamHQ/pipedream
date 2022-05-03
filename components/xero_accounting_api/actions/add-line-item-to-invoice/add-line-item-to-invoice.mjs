import { formatArrayStrings, removeNullEntries } from "../../common/util.mjs";
import constant from "../../common/common.constants.mjs";
import xero_accounting_api from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-add-line-item-to-invoice",
  name: "Add Items to Existing Sales Invoice",
  description:
    "Adds line items to an existing sales invoice. [See the docs here](https://developer.xero.com/documentation/api/accounting/invoices#post-invoices)",
  version: "0.0.1",
  type: "action",
  props: {
    xero_accounting_api,
    tenantId: {
      propDefinition: [xero_accounting_api, "tenantId"],
    },
    InvoiceID: {
      type: "string",
      label: "Invoice ID",
      description: "ID of Invoice to be updated",
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
  },
  async run({ $ }) {
    const { tenantId, InvoiceID, LineItems } = this;
    const data = removeNullEntries({
      InvoiceID,
      LineItems: formatArrayStrings(LineItems, constant.ALLOWED_LINEITEMS_KEYS),
    });
    return await this.xero_accounting_api.createInvoice(tenantId, data);
  },
};
