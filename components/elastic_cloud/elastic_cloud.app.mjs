// x-pd-ai: optimized
import { axios } from "@pipedream/platform";
import {
  BASE_URL,
  API_VERSION,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "elastic_cloud",
  propDefinitions: {
    deploymentId: {
      type: "string",
      label: "Deployment ID",
      description: "The ID of the deployment (e.g. `abc123def456`). Run the **List Deployments** action first to obtain valid deployment IDs.",
    },
    rulesetId: {
      type: "string",
      label: "Ruleset ID",
      description: "The ID of the traffic filter ruleset (e.g. `tf-ruleset-001`). Run the **List Traffic Filter Rulesets** action first to obtain valid ruleset IDs.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "A human-readable name for the resource.",
    },
    region: {
      type: "string",
      label: "Region",
      description: "The cloud region (e.g. `gcp-us-central1`).",
    },
    version: {
      type: "string",
      label: "Version",
      description: "The Elastic stack version to deploy (e.g. `8.14.0`).",
    },
    resources: {
      type: "string",
      label: "Resources",
      description: "JSON object describing the deployment resource topology. Example: `{\"elasticsearch\":[{\"region\":\"gcp-us-central1\",\"plan\":{\"cluster_topology\":[{\"size\":{\"value\":4096,\"resource\":\"memory\"},\"zone_count\":2}]}}]}`",
    },
    metadata: {
      type: "string",
      label: "Metadata",
      description: "JSON object of deployment metadata. Example: `{\"tags\":[{\"key\":\"env\",\"value\":\"prod\"}]}`",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the resource.",
    },
    includeByDefault: {
      type: "boolean",
      label: "Include By Default",
      description: "Whether to apply this ruleset to all new deployments by default.",
    },
    rules: {
      type: "string",
      label: "Rules",
      description: "JSON array of rule objects. Example: `[{\"source\":\"1.2.3.4/32\"}]`",
    },
  },
  methods: {
    _baseUrl() {
      return `${BASE_URL}/api/${API_VERSION}`;
    },
    async _makeRequest({
      $ = this, path, headers, ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `ApiKey ${this.$auth.api_key}`,
          ...headers,
        },
        ...args,
      });
    },
    async listDeployments(args) {
      return this._makeRequest({
        path: "/deployments",
        ...args,
      });
    },
    async getDeployment({
      deploymentId, ...args
    }) {
      return this._makeRequest({
        path: `/deployments/${deploymentId}`,
        ...args,
      });
    },
    async createDeployment(args) {
      return this._makeRequest({
        method: "POST",
        path: "/deployments",
        ...args,
      });
    },
    async updateDeployment({
      deploymentId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/deployments/${deploymentId}`,
        ...args,
      });
    },
    async listTrafficFilters(args) {
      return this._makeRequest({
        path: "/deployments/traffic-filter/rulesets",
        ...args,
      });
    },
    async createTrafficFilter(args) {
      return this._makeRequest({
        method: "POST",
        path: "/deployments/traffic-filter/rulesets",
        ...args,
      });
    },
    async updateTrafficFilter({
      rulesetId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/deployments/traffic-filter/rulesets/${rulesetId}`,
        ...args,
      });
    },
    async deleteTrafficFilter({
      rulesetId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/deployments/traffic-filter/rulesets/${rulesetId}`,
        ...args,
      });
    },
  },
};
