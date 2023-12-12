// legacy_hash_id: a_K5i5rd
import { axios } from "@pipedream/platform";

export default {
  key: "xero_accounting_api-get-bank-summary",
  name: "Get Bank Summary",
  description: "Gets the balances and cash movements for each bank account.",
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
    form_date: {
      type: "string",
      description: "Get the balances and cash movements for each bank account from this date",
      optional: true,
    },
    to_date: {
      type: "string",
      description: "Get the balances and cash movements for each bank account to this date",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.xero.com/documentation/api/reports#BankSummary

    if (!this.tenant_id) {
      throw new Error("Must provide tenant_id parameter.");
    }

    return await axios($, {
      url: "https://api.xero.com/api.xro/2.0/Reports/BankSummary",
      headers: {
        "Authorization": `Bearer ${this.xero_accounting_api.$auth.oauth_access_token}`,
        "xero-tenant-id": this.tenant_id,
      },
      params: {
        fromDate: this.form_date,
        toDate: this.to_date,
      },
    });
  },
};
