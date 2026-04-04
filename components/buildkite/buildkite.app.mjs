import { axios } from "@pipedream/platform";

const BASE_URL = "https://api.buildkite.com/v2";

export default {
  type: "app",
  app: "buildkite",
  propDefinitions: {
    organizationSlug: {
      type: "string",
      label: "Organization Slug",
      description: "The slug of the organization (e.g. `my-org`)",
      async options() {
        const orgs = await this.listOrganizations();
        return orgs.map(({ slug, name }) => ({
          label: name,
          value: slug,
        }));
      },
    },
    pipelineSlug: {
      type: "string",
      label: "Pipeline Slug",
      description: "The slug of the pipeline (e.g. `my-pipeline`)",
      async options({ organizationSlug }) {
        if (!organizationSlug) return [];
        const pipelines = await this.listPipelines({
          organizationSlug,
        });
        return pipelines.map(({ slug, name }) => ({
          label: name,
          value: slug,
        }));
      },
    },
    buildNumber: {
      type: "integer",
      label: "Build Number",
      description: "The number of the build",
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The UUID of the job",
    },
  },
  methods: {
    _baseUrl() {
      return BASE_URL;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_token}`,
      };
    },
    async _makeRequest({
      $ = this, path, method = "GET", params, data, headers,
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        method,
        headers: {
          ...this._headers(),
          ...headers,
        },
        params,
        data,
      });
    },
    async listOrganizations(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/organizations",
      });
    },
    async listPipelines({
      organizationSlug, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `/organizations/${organizationSlug}/pipelines`,
      });
    },
  },
};
