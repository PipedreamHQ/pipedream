import { axios } from "@pipedream/platform";
import { chainQueryString } from "./common/common.util.mjs";

export default {
  type: "app",
  app: "xero_accounting_api",
  propDefinitions: {
    tenant_id: {
      type: "string",
      description:
        "Id of the organization tenant to use on the Xero Accounting API.  See [Get Tenant Connections](https://pipedream.com/@sergio/xero-accounting-api-get-tenant-connections-p_OKCzOgn/edit) for a workflow example on how to pull this data.",
    },
  },
  methods: {
    // this.$auth contains connected account data
    async createContact(tenant_id, data) {
      return await axios(this.$auth, {
        method: "post",
        url: "https://api.xero.com/api.xro/2.0/contacts",
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          "xero-tenant-id": tenant_id,
        },
        data,
      });
    },
    async getContact(tenant_id, queryParam) {
      const newQueryParam = chainQueryString(queryParam);
      return await axios(this.$auth, {
        method: "get",
        url: `https://api.xero.com/api.xro/2.0/contacts?Where=${newQueryParam}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          "xero-tenant-id": tenant_id,
        },
      });
    },
    async createBill(tenant_id, data) {
      return await axios(this.$auth, {
        method: "post",
        url: "https://api.xero.com/api.xro/2.0/invoices",
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          "xero-tenant-id": tenant_id,
        },
        data,
      });
    },
  },
};
