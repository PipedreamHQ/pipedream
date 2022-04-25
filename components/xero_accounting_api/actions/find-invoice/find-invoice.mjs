import { axios, ConfigurationError } from "@pipedream/platform";
import {
  chainQueryString,
  formatQueryString,
  removeNullEntries,
} from "../../common/common.util.mjs";

export default {
  key: "xero_accounting_api-find-invoice",
  name: "Find Invoice",
  description: "Finds an invoice by number or reference.",
  version: "0.0.1",
  type: "action",
  props: {
    xero_accounting_api: {
      type: "app",
      app: "xero_accounting_api",
    },
    tenant_id: {
      type: "string",
    },
    InvoiceNumber: {
      type: "string",
      optional: true,
    },
    Reference: {
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const { InvoiceNumber, Reference } = this;
    if ((InvoiceNumber && Reference) || (!InvoiceNumber && !Reference)) {
      throw new ConfigurationError(
        `${
          InvoiceNumber && Reference ? "Only o" : "O"
        }ne of InvoiceNumber and Reference is required to find contact`
      );
    }
    const payload = removeNullEntries({
      InvoiceNumber,
      Reference,
    });
    const queryString = formatQueryString(payload, true);
    const newQueryParam = chainQueryString(queryString);
    return await axios($, {
      url: `https://api.xero.com/api.xro/2.0/Invoices?Where=${newQueryParam}`,
      headers: {
        Authorization: `Bearer ${this.xero_accounting_api.$auth.oauth_access_token}`,
        "xero-tenant-id": this.tenant_id,
      },
    });
  },
};
