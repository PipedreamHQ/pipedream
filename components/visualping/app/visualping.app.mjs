import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "visualping",
  propDefinitions: {
    jobId: {
      label: "Job ID",
      description: "The job ID",
      type: "string",
      async options({ page }) {
        const { jobs } = await this.getJobs({
          params: {
            pageIndex: page,
            pageSize: 10,
          },
        });

        return jobs.map((job) => ({
          value: job.id,
          label: job.url,
        }));
      },
    },
  },
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://job.api.visualping.io";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...args,
      });
    },
    async getCurrentUser(args = {}) {
      return this._makeRequest({
        url: "https://account.api.visualping.io/describe-user",
        ...args,
      });
    },
    async getJobs(args = {}) {
      const { organisation: { id } } = await this.getCurrentUser();

      return this._makeRequest({
        path: "/v2/jobs",
        ...args,
        params: {
          organisationId: id,
          ...args.params,
        },
      });
    },
    async getJob({
      jobId, ...args
    }) {
      const { organisation: { id } } = await this.getCurrentUser();

      return this._makeRequest({
        path: `/v2/jobs/${jobId}`,
        ...args,
        params: {
          organisationId: id,
          ...args.params,
        },
      });
    },
  },
};
