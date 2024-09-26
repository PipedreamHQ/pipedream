import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "bytenite",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to use",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const { data } = await this.listTemplates({
          params: {
            limit,
            offset: page * limit,
          },
        });
        return data?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of the video encoding job",
      async options({
        page, completedOnly = false,
      }) {
        const limit = constants.DEFAULT_LIMIT;
        let { data } = await this.listJobs({
          params: {
            limit,
            offset: page * limit,
          },
        });
        if (completedOnly) {
          data = data.filter(({ state }) => state === "JOB_STATE_COMPLETE");
        }
        return data?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.bytenite.com/v1";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/customer/jobs/templates",
        ...opts,
      });
    },
    listJobs(opts = {}) {
      return this._makeRequest({
        path: "/customer/jobs",
        ...opts,
      });
    },
    getResults({
      jobId, ...opts
    }) {
      return this._makeRequest({
        path: `/customer/jobs/${jobId}/results`,
        ...opts,
      });
    },
    createJob(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/customer/jobs",
        ...opts,
      });
    },
    startJob({
      jobId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/customer/jobs/run/${jobId}`,
        ...opts,
      });
    },
  },
};
