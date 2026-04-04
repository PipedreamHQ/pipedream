import { axios } from "@pipedream/platform";

const BASE_URL = "https://api.buildkite.com/v2";
const DEFAULT_LIMIT = 100;

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
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of records to return",
      optional: true,
      default: 100,
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
    async *paginate({
      $, path, params = {}, max,
    }) {
      let page = 1;
      let count = 0;
      while (true) {
        const items = await this._makeRequest({
          $,
          path,
          params: {
            ...params,
            page,
            per_page: DEFAULT_LIMIT,
          },
        });
        if (!items?.length) {
          return;
        }
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        if (items.length < DEFAULT_LIMIT) {
          return;
        }
        page++;
      }
    },
    listOrganizations(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/organizations",
      });
    },
    listPipelines({
      organizationSlug, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `/organizations/${organizationSlug}/pipelines`,
      });
    },
  },
};
