// legacy_hash_id: a_q1i3Aj
import { axios } from "@pipedream/platform";

export default {
  key: "xero_accounting_api-email-an-invoice",
  name: "Email an Invoice",
  description: "Triggers the email of a sales invoice out of Xero.",
  version: "0.1.1",
  type: "action",
  props: {
    xero_accounting_api: {
      type: "app",
      app: "xero_accounting_api",
    },
    tenant_id: {
      type: "string",
      description: "Id of the organization tenant to use on the Xero Accounting API. See [Get Tenant Connections](https://pipedream.com/@sergio/xero-accounting-api-get-tenant-connections-p_OKCzOgn/edit) for a workflow example on how to pull this data.",
    },
    invoice_id: {
      type: "string",
      description: "Xero generated unique identifier for the invoice to send by email out of Xero. The invoice must be of Type ACCREC and a valid Status for sending (SUMBITTED,AUTHORISED or PAID).",
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.xero.com/documentation/api/invoices#email

    if (!this.tenant_id || !this.invoice_id) {
      throw new Error("Must provide tenant_id, invoice_id parameters.");
    }

    return await axios($, {
      method: "post",
      url: `https://api.xero.com/api.xro/2.0/Invoices/${this.invoice_id}/Email`,
      headers: {
        "Authorization": `Bearer ${this.xero_accounting_api.$auth.oauth_access_token}`,
        "xero-tenant-id": this.tenant_id,
      },
    });
  },
};
