import {
  formatLineItems,
  removeNullEntries,
} from "../../common/util.mjs";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-add-line-item-to-invoice",
  name: "Add Items to Existing Sales Invoice",
  description: "Adds line items to an existing sales invoice. [See the docs here](https://developer.xero.com/documentation/api/accounting/invoices#post-invoices)",
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
    const response = await this.xeroAccountingApi.createInvoice({
      $,
      tenantId: this.tenantId,
      data: removeNullEntries({
        InvoiceID: this.invoiceId,
        LineItems: formatLineItems(this.lineItems),
      }),
    });

    response && $.export("$summary", "Line item created successfully");
    return response;
  },
};
