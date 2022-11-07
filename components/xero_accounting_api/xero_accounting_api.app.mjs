import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import { chainQueryString } from "./common/util.mjs";

export default {
  type: "app",
  app: "xero_accounting_api",
  propDefinitions: {
    tenantId: {
      type: "string",
      label: "Tenant ID",
      description:
        "Id of the organization tenant to use on the Xero Accounting API. See [Get Tenant Connections](https://pipedream.com/@sergio/xero-accounting-api-get-tenant-connections-p_OKCzOgn/edit) for a workflow example on how to pull this data.",
      async options() {
        return this.getTenantsOpts();
      },
    },
  },
  methods: {
    setLastDateChecked(db, value) {
      db && db.set(constants.DB_LAST_DATE_CHECK, value);
    },
    getLastDateChecked(db) {
      return db && db.get(constants.DB_LAST_DATE_CHECK);
    },
    getHeader(tenantId, modifiedSince = null) {
      const header = {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
      tenantId && (header["xero-tenant-id"] = tenantId);
      modifiedSince && (header["If-Modified-Since"] = modifiedSince);
      return header;
    },
    getUrl(path) {
      const {
        BASE_URL,
        DEFAULT_API_PATH,
        VERSION_PATH,
      } = constants;
      return `${BASE_URL}${DEFAULT_API_PATH}${VERSION_PATH}${path}`;
    },
    async makeRequest(args = {}) {
      const {
        $,
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
      return axios($ ?? this, config);
    },
    async getTenantsOpts() {
      const { BASE_URL } = constants;
      const tenants = await axios(this, {
        url: `${BASE_URL}/connections`,
        headers: this.getHeader(),
      });
      return tenants.map((tenant) => ({
        label: tenant.tenantName,
        value: tenant.tenantId,
      }));
    },
    async createContact($, tenantId, data) {
      return this.makeRequest({
        $,
        tenantId,
        method: "post",
        path: "/contacts",
        data,
      });
    },
    async getContact($, tenantId, queryParam, modifiedSince = null) {
      const where = chainQueryString(queryParam);
      return this.makeRequest({
        $,
        tenantId,
        modifiedSince,
        path: "/contacts",
        params: where && {
          Where: where,
        },
      });
    },
    async createInvoice($, tenantId, data) {
      return this.makeRequest({
        $,
        tenantId,
        method: "post",
        path: "/invoices",
        data,
      });
    },
    async getInvoice($, tenantId, queryParam, modifiedSince = null) {
      const where = chainQueryString(queryParam);
      return this.makeRequest({
        $,
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
