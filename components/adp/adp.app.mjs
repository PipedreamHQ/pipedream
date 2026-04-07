import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "adp",
  propDefinitions: {
    associateOID: {
      type: "string",
      label: "Associate OID",
      description: "The unique OID of the worker (e.g. `G3349PZGBAZW8PHM`). Found in the response of the **Get Workers** action.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.adp.com";
    },
    async _makeRequest({
      $,
      method = "GET",
      path,
      params,
      data,
    }) {
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
        params,
        data,
      });
    },
    /** List workers. Supports OData `$filter`, `$top`, `$skip`, `$select`. */
    async getWorkers({
      $, params,
    } = {}) {
      return this._makeRequest({
        $,
        path: "/hr/v2/workers",
        params,
      });
    },
    /** Single worker by associate OID. */
    async getWorker({
      $, associateOID,
    }) {
      return this._makeRequest({
        $,
        path: `/hr/v2/workers/${associateOID}`,
      });
    },
    /** Worker demographics (WFN v2). Not under `/workers/.../demographics`. */
    async getWorkerDemographics({
      $, associateOID,
    }) {
      return this._makeRequest({
        $,
        path: `/hr/v2/worker-demographics/${associateOID}`,
      });
    },
  },
};
