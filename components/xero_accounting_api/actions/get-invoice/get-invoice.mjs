// legacy_hash_id: a_52ieOd
import { axios } from "@pipedream/platform";

export default {
  key: "xero_accounting_api-get-invoice",
  name: "Get Invoice",
  description: "Gets details of an invoice.",
  version: "0.1.1",
  type: "action",
  props: {
    xero_accounting_api: {
      type: "app",
      app: "xero_accounting_api",
    },
    tenant_id: {
      type: "string",
    },
    invoice_id: {
      type: "string",
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.xero.com/documentation/api/invoices#get

    if (!this.tenant_id || !this.invoice_id) {
      throw new Error("Must provide tenant_id, invoice_id parameters.");
    }

    return await axios($, {
      url: `https://api.xero.com/api.xro/2.0/Invoices/${this.invoice_id}`,
      headers: {
        "Authorization": `Bearer ${this.xero_accounting_api.$auth.oauth_access_token}`,
        "xero-tenant-id": this.tenant_id,
      },
    });
  },
};
