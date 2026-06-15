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
    limit: {
      type: "integer",
      label: "Limit",
      description: "Limit the number of items in response",
      optional: true,
      default: 50,
      min: 1,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Offset the number of items in response",
      optional: true,
      default: 0,
      min: 0,
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
    listFeatureFlags(opts = {}) {
      return this._makeRequest({
        path: "/feature-flags",
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
    listExperiments(opts = {}) {
      return this._makeRequest({
        path: "/experiments",
        ...opts,
      });
    },
    getExperiment({
      experimentId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/experiments/${experimentId}`,
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
    listMetrics(opts = {}) {
      return this._makeRequest({
        path: "/metrics",
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
        method: "PUT",
        path: `/metrics/${metricId}`,
        data,
        ...opts,
      });
    },
  },
};
