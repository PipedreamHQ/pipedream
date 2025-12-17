import { ConfigurationError } from "@pipedream/platform";
import {
  formatQueryString, removeNullEntries,
} from "../../common/util.mjs";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-find-invoice",
  name: "Find Invoice",
  description: "Finds an invoice by number or reference.[See the docs here](https://developer.xero.com/documentation/api/accounting/invoices/#get-invoices)",
  version: "0.0.5",
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
  },
  async run({ $ }) {
    const {
      invoiceNumber,
      reference,
      tenantId,
    } = this;
    if ((invoiceNumber && reference) || (!invoiceNumber && !reference)) {
      throw new ConfigurationError("Choose exclusively between **Invoice Number** or **Reference** to find an invoice.");
    }
    const payload = removeNullEntries({
      InvoiceNumber: invoiceNumber,
      Reference: reference,
    });
    const queryString = formatQueryString(payload, true);
    const response = await this.xeroAccountingApi.getInvoice({
      $,
      tenantId,
      queryParam: queryString,
    });
    response && $.export("$summary", "Invoice loaded successfully");
    return response;
  },
};
