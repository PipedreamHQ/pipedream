// legacy_hash_id: a_zNiJzL
import { axios } from "@pipedream/platform";

export default {
  key: "xero_accounting_api-get-bank-statements-report",
  name: "Bank Statements Report",
  description: "Gets bank statements for the specified bank account.",
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
    bank_account_id: {
      type: "string",
      description: "Xero identifier of the bank account to get bank statements of",
    },
    from_date: {
      type: "string",
      description: "Get the bank statements of the specified bank account from this date",
      optional: true,
    },
    to_date: {
      type: "string",
      description: "Get the bank statements of the specified bank account to this date",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.xero.com/documentation/api/api-overview

    if (!this.tenant_id || !this.bank_account_id) {
      throw new Error("Must provide tenant_id, bank_account_id parameters.");
    }

    return await axios($, {
      url: "https://api.xero.com/api.xro/2.0/Reports/BankStatement",
      headers: {
        "Authorization": `Bearer ${this.xero_accounting_api.$auth.oauth_access_token}`,
        "xero-tenant-id": this.tenant_id,
      },
      params: {
        fromDate: this.from_date,
        toDate: this.to_date,
        bankAccountID: this.bank_account_id,
      },
    });
  },
};
