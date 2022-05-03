import { axios } from "@pipedream/platform";
import { chainQueryString } from "./common/common.util.mjs";

export default {
  type: "app",
  app: "xero_accounting_api",
  propDefinitions: {
    tenant_id: {
      type: "string",
      label: "Tenant ID",
      description:
        "Id of the organization tenant to use on the Xero Accounting API.  See [Get Tenant Connections](https://pipedream.com/@sergio/xero-accounting-api-get-tenant-connections-p_OKCzOgn/edit) for a workflow example on how to pull this data.",
    },
  },
  methods: {
    getHeader(tenantId, modifiedSince = null) {
      const header = {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        "xero-tenant-id": tenantId,
      };
      modifiedSince && (header["If-Modified-Since"] = modifiedSince);
      return header;
    },
    getUrl(path) {
      const BASE_URL = "https://api.xero.com";
      const VERSION_PATH = "/2.0";
      const DEFAULT_API_PATH = "/api.xro";
      return `${BASE_URL}${DEFAULT_API_PATH}${VERSION_PATH}${path}`;
    },
    async makeRequest(args = {}) {
      const {
        $ = this,
        tenantId,
        modifiedSince,
        method = "get",
        path,
        params,
        data,
      } = args;
      const config = {
        method,
        url: this.getUrl(path),
        headers: this.getHeader(tenantId, modifiedSince),
        params,
        data,
      };
      return axios($, config);
    },
    async createContact(tenantId, data) {
      return this.makeRequest({
        tenantId,
        method: "post",
        path: "/contacts",
        data,
      });
    },
    async getContact(tenantId, queryParam, modifiedSince = null) {
      const where = chainQueryString(queryParam);
      return this.makeRequest({
        tenantId,
        modifiedSince,
        path: "/contacts",
        params: where && {
          Where: where,
        },
      });
    },
    async createInvoice(tenantId, data) {
      return this.makeRequest({
        tenantId,
        method: "post",
        path: "/invoices",
        data,
      });
    },
    async getInvoice(tenantId, queryParam, modifiedSince = null) {
      const where = chainQueryString(queryParam);
      return this.makeRequest({
        tenantId,
        modifiedSince,
        path: "/invoices",
        params: where && {
          Where: where,
        },
      });
    },
  },
};
