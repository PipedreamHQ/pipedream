import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "databricks",
  propDefinitions: {
    jobId: {
      type: "string",
      label: "Job",
      description: "Identifier of a job",
      async options() {
        const { jobs } = await this.listJobs();
        return jobs?.map(({
          job_id: value, settings,
        }) => ({
          value,
          label: settings.name,
        })) || [];
      },
    },
    runId: {
      type: "string",
      label: "Run",
      description: "Identifier of a run",
      async options({
        jobId, page,
      }) {
        const limit = 20;
        const params = {
          limit,
          offset: page * limit,
        };
        if (jobId) {
          params.job_id = jobId;
        }
        const { runs } = await this.listRuns({
          params,
        });
        return runs?.map(({
          run_id: value, run_name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.domain}.cloud.databricks.com/api/2.0`;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.access_token}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listJobs(args = {}) {
      return this._makeRequest({
        path: "/jobs/list",
        ...args,
      });
    },
    listRuns(args = {}) {
      return this._makeRequest({
        path: "/jobs/runs/list",
        ...args,
      });
    },
    getRunOutput(args = {}) {
      return this._makeRequest({
        path: "/jobs/runs/get-output",
        ...args,
      });
    },
    runJobNow(args = {}) {
      return this._makeRequest({
        path: "/jobs/run-now",
        method: "POST",
        ...args,
      });
    },
  },
};
