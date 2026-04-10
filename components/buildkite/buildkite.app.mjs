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
        return orgs.map(({
          slug, name,
        }) => ({
          label: name,
          value: slug,
        }));
      },
    },
    pipelineSlug: {
      type: "string",
      label: "Pipeline Slug",
      description: "The slug of the pipeline (e.g. `my-pipeline`)",
      async options({
        organizationSlug, page,
      }) {
        if (!organizationSlug) return [];
        const pipelines = await this.listPipelines({
          organizationSlug,
          params: {
            page: page + 1,
          },
        });
        return pipelines.map(({
          slug, name,
        }) => ({
          label: name,
          value: slug,
        }));
      },
    },
    buildNumber: {
      type: "integer",
      label: "Build Number",
      description: "The number of the build",
      async options({
        organizationSlug, pipelineSlug, page,
      }) {
        if (!organizationSlug || !pipelineSlug) return [];
        const builds = await this.listBuilds({
          organizationSlug,
          pipelineSlug,
          params: {
            page: page + 1,
          },
        });
        return builds?.map(({ number }) => ({
          label: `Build #${number}`,
          value: number,
        })) || [];
      },
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The UUID of the job",
      async options({
        organizationSlug, pipelineSlug, buildNumber,
      }) {
        if (!organizationSlug || !pipelineSlug || !buildNumber) return [];
        const build = await this.getBuild({
          organizationSlug,
          pipelineSlug,
          buildNumber,
        });
        return build?.jobs?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    artifactId: {
      type: "string",
      label: "Artifact ID",
      description: "The UUID of the artifact to download",
      async options({
        organizationSlug, pipelineSlug, buildNumber, jobId, page,
      }) {
        if (!organizationSlug || !pipelineSlug || !buildNumber) return [];
        const artifacts = await this.listArtifacts({
          organizationSlug,
          pipelineSlug,
          buildNumber,
          jobId,
          params: {
            page: page + 1,
          },
        });
        return artifacts?.map(({
          id, path,
        }) => ({
          label: path,
          value: id,
        })) || [];
      },
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
    getBuild({
      organizationSlug, pipelineSlug, buildNumber, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `/organizations/${organizationSlug}/pipelines/${pipelineSlug}/builds/${buildNumber}`,
      });
    },
    listBuilds({
      organizationSlug, pipelineSlug, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `/organizations/${organizationSlug}/pipelines/${pipelineSlug}/builds`,
      });
    },
    listArtifacts({
      organizationSlug, pipelineSlug, buildNumber, jobId, ...opts
    }) {
      const jobPath = jobId
        ? `/jobs/${jobId}`
        : "";
      return this._makeRequest({
        ...opts,
        path: `/organizations/${organizationSlug}/pipelines/${pipelineSlug}/builds/${buildNumber}${jobPath}/artifacts`,
      });
    },
  },
};
