import { ConfigurationError } from "@pipedream/platform";
import {
  formatQueryString, removeNullEntries,
} from "../../common/util.mjs";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-find-invoice",
  name: "Find Invoice",
  description:
    "Finds an invoice by number or reference.[See the docs here](https://developer.xero.com/documentation/api/accounting/invoices/#get-invoices)",
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
  },
  async run({ $ }) {
    const {
      InvoiceNumber,
      Reference,
      tenantId,
    } = this;
    if ((InvoiceNumber && Reference) || (!InvoiceNumber && !Reference)) {
      throw new ConfigurationError(
        `${InvoiceNumber && Reference
          ? "Only o"
          : "O"
        }ne of InvoiceNumber and Reference is required to find contact`,
      );
    }
    const payload = removeNullEntries({
      InvoiceNumber,
      Reference,
    });
    const queryString = formatQueryString(payload, true);
    console.log({
      tenantId,
      queryString,
    });
    const response = await this.xeroAccountingApi.getInvoice($, tenantId, queryString);
    response && $.export("$summary", "Invoice loaded successfullty");
    return response;
  },
};
