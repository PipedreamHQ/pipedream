import xeroAccountingApi from "../../xero_accounting_api.app.mjs";
import {
  removeNullEntries,
  formatLineItems,
} from "../../common/util.mjs";

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
    invoiceId: {
      propDefinition: [
        xeroAccountingApi,
        "invoiceId",
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
  },
  async run({ $ }) {
    const {
      tenantId,
      invoiceId,
      lineItems,
    } = this;
    const data = removeNullEntries({
      InvoiceID: invoiceId,
      LineItems: formatLineItems(lineItems),
    });
    const response = await this.xeroAccountingApi.createInvoice($, tenantId, data);
    response && $.export("$summary", "Line item created successfully");
    return response;
  },
};
