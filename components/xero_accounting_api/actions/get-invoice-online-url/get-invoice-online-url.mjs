import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-get-invoice-online-url",
  name: "Get Sales Invoice Online URL",
  description: "Retrieves the online sales invoice URL.",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
      label: "Invoice ID",
      type: "string",
      description: "Xero generated unique identifier for the invoice to retrieve its online url.",
    },
  },
  async run({ $ }) {
    try {
      const response = await this.xeroAccountingApi.getInvoiceOnlineUrl({
        $,
        tenantId: this.tenantId,
        invoiceId: this.invoiceId,
      });

      $.export("$summary", `Invoice online URL retrieved successfully: ${this.invoiceId}`);
      return response;
    } catch (e) {
      $.export("$summary", `No invoice found with identifier: ${this.invoiceId}`);
      return {};
    }
  },
};
