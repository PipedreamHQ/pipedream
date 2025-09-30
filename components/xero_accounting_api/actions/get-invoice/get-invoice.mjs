import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-get-invoice",
  name: "Get Invoice",
  description: "Gets details of an invoice.",
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
      description: "The ID of the invoice to get.",
      type: "string",
    },
  },
  async run({ $ }) {
    try {
      const response = await this.xeroAccountingApi.getInvoiceById({
        $,
        tenantId: this.tenantId,
        invoiceId: this.invoiceId,
      });

      $.export("$summary", `Invoice retrieved successfully: ${this.invoiceId}`);
      return response;
    } catch (e) {
      $.export("$summary", `No invoice found with identifier: ${this.invoiceId}`);
      return {};
    }
  },
};
