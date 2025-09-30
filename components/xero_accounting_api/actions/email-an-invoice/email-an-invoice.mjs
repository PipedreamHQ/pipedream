import { ConfigurationError } from "@pipedream/platform";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-email-an-invoice",
  name: "Email an Invoice",
  description: "Triggers the email of a sales invoice out of Xero.",
  version: "0.1.3",
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
      label: "Invoice ID",
      type: "string",
      description: "Xero generated unique identifier for the invoice to send by email out of Xero. The invoice must be of Type ACCREC and a valid Status for sending (SUMBITTED,AUTHORISED or PAID).",
    },
  },
  async run({ $ }) {
    if (!this.tenantId || !this.invoiceId) {
      throw new ConfigurationError("Must provide **Tenant ID**, and **Invoice ID** parameters.");
    }

    const response = await this.xeroAccountingApi.emailInvoice({
      $,
      tenantId: this.tenantId,
      invoiceId: this.invoiceId,
    });

    $.export("$summary", `Invoice emailed successfully: ${this.invoiceId}`);
    return response;
  },
};
