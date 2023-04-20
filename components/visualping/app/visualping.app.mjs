import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "visualping",
  propDefinitions: {
    jobId: {
      label: "Job ID",
      description: "The job ID",
      type: "string",
      async options({
        workspaceId, page,
      }) {
        const { jobs } = await this.getJobs({
          workspaceId,
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
    workspaceId: {
      label: "Workspace ID",
      description: "The workspace ID",
      type: "string",
      async options() {
        const { workspaces } = await this.getWorkspaces();

        return workspaces.map((workspace) => ({
          value: workspace.id,
          label: workspace.name,
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
    async getWorkspaces(args = {}) {
      return this._makeRequest({
        url: "https://account.api.visualping.io/describe-user",
        ...args,
      });
    },
    async getJobs({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: "/v2/jobs",
        ...args,
        params: {
          workspaceId,
          ...args.params,
        },
      });
    },
    async getJob({
      workspaceId, jobId, ...args
    }) {
      return this._makeRequest({
        path: `/v2/jobs/${jobId}`,
        ...args,
        params: {
          workspaceId,
          ...args.params,
        },
      });
    },
  },
};
