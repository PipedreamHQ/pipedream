import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "newscatcher",
  propDefinitions: {
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of the job",
      async options({ page }) {
        const { jobs } = await this.listJobs({
          params: {
            page: page + 1,
          },
        });
        return jobs?.map((job) => ({
          label: job.query,
          value: job.job_id,
        })) || [];
      },
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number to retrieve",
      default: 1,
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Number of records per page",
      default: 100,
      min: 1,
      max: 1000,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://catchall.newscatcherapi.com";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-api-key": this.$auth.api_key,
        },
        ...opts,
      });
    },
    listJobs(opts = {}) {
      return this._makeRequest({
        path: "/catchAll/jobs/user",
        ...opts,
      });
    },
    getJobResults({
      jobId, ...opts
    }) {
      return this._makeRequest({
        path: `/catchAll/pull/${jobId}`,
        ...opts,
      });
    },
    createJob(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/catchAll/submit",
        ...opts,
      });
    },
    continueJob(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/catchAll/continue",
        ...opts,
      });
    },
    createMonitor(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/catchAll/monitors/create",
        ...opts,
      });
    },
    enableMonitor({
      monitorId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/catchAll/monitors/${monitorId}/enable`,
        ...opts,
      });
    },
    disableMonitor({
      monitorId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/catchAll/monitors/${monitorId}/disable`,
        ...opts,
      });
    },
  },
};
