import { axios } from "@pipedream/platform";

const DEFAULT_BASE_URL = "https://webservices3.autotask.net/ATServicesRest";

export default {
  type: "app",
  app: "autotask_psa",
  propDefinitions: {},
  methods: {
    /**
     * Reads connection fields from `$auth` (OAuth or API user flows). Supports
     * snake_case and camelCase: base_url/baseUrl, api_integration_code/
     * apiIntegrationCode, username, secret, impersonation_resource_id/
     * impersonationResourceId (optional).
     */
    _credentials() {
      const a = this.$auth || {};
      const baseUrlRaw = a.base_url || a.baseUrl || DEFAULT_BASE_URL;
      const baseUrl = String(baseUrlRaw).replace(/\/+$/, "");
      const username = a.username;
      const secret = a.secret;
      const apiIntegrationCode = a.api_integration_code || a.apiIntegrationCode;
      const impersonationRaw =
        a.impersonation_resource_id ?? a.impersonationResourceId;
      const impersonationResourceId =
        impersonationRaw != null && String(impersonationRaw).trim() !== ""
          ? String(impersonationRaw)
          : undefined;
      return {
        baseUrl,
        username,
        secret,
        apiIntegrationCode,
        impersonationResourceId,
      };
    },

    /** Autotask REST headers per https://www.autotask.net/help/DeveloperHelp/Content/APIs/REST/General_Topics/REST_Security_Auth.htm */
    _headers() {
      const {
        username,
        secret,
        apiIntegrationCode,
        impersonationResourceId,
      } = this._credentials();
      const headers = {
        "Username": username,
        "Secret": secret,
        "ApiIntegrationCode": apiIntegrationCode,
        "Content-Type": "application/json",
      };
      if (impersonationResourceId != null) {
        headers["ImpersonationResourceId"] = impersonationResourceId;
      }
      return headers;
    },

    _entityUrl(entity, suffix) {
      const { baseUrl } = this._credentials();
      return `${baseUrl}/v1.0/${entity}/${suffix}`;
    },

    /**
     * POST entity query (list / search).
     * @param {object} opts
     * @param {object} [opts.$] - Pipedream axios context
     * @param {string} opts.entity - REST entity name (e.g. `Companies`)
     * @param {object} opts.data - Body: MaxRecords, IncludeFields, filter, etc.
     */
    queryEntity({
      $ = this, entity, data,
    }) {
      return axios($, {
        method: "POST",
        url: this._entityUrl(entity, "query"),
        headers: this._headers(),
        data,
      });
    },

    /**
     * POST entity query count.
     * @param {object} opts
     * @param {object} [opts.$] - Pipedream axios context
     * @param {string} opts.entity - REST entity name (e.g. `Companies`)
     * @param {object} opts.data - Same filter shape as `queryEntity`
     */
    queryEntityCount({
      $ = this, entity, data,
    }) {
      return axios($, {
        method: "POST",
        url: this._entityUrl(entity, "query/count"),
        headers: this._headers(),
        data,
      });
    },
  },
};
