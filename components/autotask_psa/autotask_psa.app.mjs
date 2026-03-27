import { axios } from "@pipedream/platform";

const DEFAULT_BASE_URL = "https://webservices3.autotask.net/ATServicesRest";

export default {
  type: "app",
  app: "autotask_psa",
  propDefinitions: {},
  methods: {
    _credentials() {
      const {
        url,
        username,
        password,
        api_integration_code,
      } = this.$auth || {};
      return {
        baseUrl: (url || DEFAULT_BASE_URL).replace(/\/+$/, ""),
        username,
        secret: password,
        apiIntegrationCode: api_integration_code,
      };
    },

    /**
     * Autotask auth headers (UserName casing per API).
     * @see https://www.autotask.net/help/DeveloperHelp/Content/APIs/REST/General_Topics/REST_Security_Auth.htm
     */
    _headers() {
      const {
        username,
        secret,
        apiIntegrationCode,
      } = this._credentials();
      return {
        "UserName": username,
        "Secret": secret,
        "ApiIntegrationCode": apiIntegrationCode,
        "Content-Type": "application/json",
      };
    },

    /**
     * Generic HTTP helper for `/V1.0/{path}` (POST by default).
     * @param {object} opts
     * @param {object} [opts.$]
     * @param {string} [opts.method]
     * @param {string} opts.path - Path under `V1.0` (e.g. `Companies/query`)
     * @param {object} [opts.data]
     */
    makeRequest({
      $ = this, method = "POST", path, data,
    }) {
      const { baseUrl } = this._credentials();
      return axios($, {
        method,
        url: `${baseUrl}/V1.0/${path}`,
        headers: this._headers(),
        data,
      });
    },

    /**
     * POST `/V1.0/{entity}/query` with JSON body.
     * @param {object} opts
     * @param {object} [opts.$]
     * @param {string} opts.entity - REST entity name (e.g. `Companies`)
     * @param {object} opts.data - MaxRecords, IncludeFields, filter, etc.
     */
    queryEntity({
      $ = this, entity, data,
    }) {
      return this.makeRequest({
        $,
        path: `${entity}/query`,
        data,
      });
    },

    /**
     * POST `/V1.0/{entity}/query/count` with the same body as `queryEntity`.
     * @param {object} opts
     * @param {object} [opts.$]
     * @param {string} opts.entity
     * @param {object} opts.data
     */
    queryEntityCount({
      $ = this, entity, data,
    }) {
      return this.makeRequest({
        $,
        path: `${entity}/query/count`,
        data,
      });
    },
  },
};
