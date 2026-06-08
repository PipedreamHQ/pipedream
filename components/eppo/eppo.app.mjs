import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "eppo",
  propDefinitions: {
    flagId: {
      type: "integer",
      label: "Flag ID",
      description: "The numeric ID of the feature flag. Use **List Feature Flags** to discover flag IDs.",
    },
  },
  methods: {
    _makeRequest({
      $ = this, path, method = "GET", params, data, ...opts
    } = {}) {
      return axios($, {
        url: `https://eppo.cloud/api/v1${path}`,
        method,
        headers: {
          "X-Eppo-Token": this.$auth.api_key,
        },
        params,
        data,
        ...opts,
      });
    },
    listFeatureFlags({
      enabled, includeArchived, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/flags",
        params: {
          enabled,
          include_archived: includeArchived,
        },
        ...opts,
      });
    },
    getFeatureFlag({
      flagId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/feature-flags/${flagId}`,
        ...opts,
      });
    },
    createFeatureFlag({
      data, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/feature-flags",
        data,
        ...opts,
      });
    },
    updateFeatureFlag({
      flagId, data, ...opts
    } = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/feature-flags/${flagId}`,
        data,
        ...opts,
      });
    },
    updateFlagEnvironmentStatus({
      flagId, environmentId, data, ...opts
    } = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/feature-flags/${flagId}/environments/${environmentId}/update-status`,
        data,
        ...opts,
      });
    },
    listExperiments({
      status, includeArchived, includeResults, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/experiments",
        params: {
          status,
          include_archived: includeArchived,
          include_results: includeResults,
        },
        ...opts,
      });
    },
    getExperiment({
      experimentId, includeResults = true, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/experiments/${experimentId}`,
        params: {
          include_results: includeResults,
        },
        ...opts,
      });
    },
    createExperiment({
      data, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/experiments",
        data,
        ...opts,
      });
    },
    listMetrics({
      page, perPage, certified, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/metrics",
        params: {
          page,
          per_page: perPage,
          certified,
        },
        ...opts,
      });
    },
    createMetric({
      data, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/metrics",
        data,
        ...opts,
      });
    },
    updateMetric({
      metricId, data, ...opts
    } = {}) {
      return this._makeRequest({
        method: "PATCH",
        path: `/metrics/${metricId}`,
        data,
        ...opts,
      });
    },
  },
};
