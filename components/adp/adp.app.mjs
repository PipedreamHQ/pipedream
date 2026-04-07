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
    _requestTimeoutMs() {
      return 60_000;
    },
    /**
     * Normalize `workers` from a collection response to an array.
     * ADP may return an array or a single worker object under `workers`.
     * @param {Record<string, unknown>|undefined} response
     * @returns {unknown[]}
     */
    workersArrayFromResponse(response) {
      const w = response?.workers;
      if (Array.isArray(w)) return w;
      if (w && typeof w === "object") return [
        w,
      ];
      return [];
    },
    /**
     * Single worker from a detail response: `workers` array, one `workers` object, or root payload.
     * @param {Record<string, unknown>|undefined} response
     */
    workerRecordFromResponse(response) {
      const w = response?.workers;
      if (Array.isArray(w) && w.length) return w[0];
      if (w && typeof w === "object" && !Array.isArray(w)) return w;
      return response;
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
        timeout: this._requestTimeoutMs(),
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
      const id = encodeURIComponent(associateOID);
      return this._makeRequest({
        $,
        path: `/hr/v2/workers/${id}`,
      });
    },
    /** Worker demographics (WFN v2). Not under `/workers/.../demographics`. */
    async getWorkerDemographics({
      $, associateOID,
    }) {
      const id = encodeURIComponent(associateOID);
      return this._makeRequest({
        $,
        path: `/hr/v2/worker-demographics/${id}`,
      });
    },
  },
};
