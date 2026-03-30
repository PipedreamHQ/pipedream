import { axios } from "@pipedream/platform";

const DEFAULT_BASE_URL = "https://webservices3.autotask.net/ATServicesRest";

export default {
  type: "app",
  app: "autotask_psa",
  propDefinitions: {
    filter: {
      type: "object",
      label: "Filter",
      description:
        "POST body for entity query: `filter` (conditions array); optional " +
        "`IncludeFields`, `MaxRecords`, etc. Omitting `filter` can return a 500 error. " +
        "An empty `filter` array returns no records. If you type `filter` as text in " +
        "the object UI, use valid JSON (it is parsed before the request). " +
        "Operators: eq, noteq, gt, gte, lt, lte, beginsWith, endsWith, contains, " +
        "exist, notExist, in, notIn; group with `and`/`or` and nested `items`. " +
        "For UDFs add `\"udf\": true` on the filter object (one UDF per request). " +
        "Include `Id` in IncludeFields when paginating past 500 rows. " +
        "Example: " +
        "`{\"MaxRecords\":100,\"IncludeFields\":[],\"filter\":[" +
        "{\"field\":\"companyName\",\"op\":\"eq\",\"value\":\"Acme Corp\"}]}`. " +
        "[Basic queries](https://www.autotask.net/help/DeveloperHelp/Content/APIs/" +
        "REST/API_Calls/REST_Basic_Query_Calls.htm), " +
        "[Advanced features](https://www.autotask.net/help/DeveloperHelp/Content/" +
        "APIs/REST/API_Calls/REST_Advanced_Query_Features.htm).",
    },
  },
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
