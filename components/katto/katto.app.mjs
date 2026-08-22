import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "katto",
  propDefinitions: {
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The id of a Katto clip job (returned by Create Clip Job).",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of jobs to return.",
      optional: true,
      default: 20,
    },
  },
  methods: {
    _baseUrl() {
      return "https://katto.tech/api/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $ = this, path, ...args
    } = {}) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    async createJob(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/jobs",
        ...args,
      });
    },
    async getJob({
      jobId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/jobs/${jobId}`,
        ...args,
      });
    },
    async listJobs(args = {}) {
      return this._makeRequest({
        path: "/jobs",
        ...args,
      });
    },
    async getClips({
      jobId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/jobs/${jobId}/clips`,
        ...args,
      });
    },
    async getTranscript({
      jobId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/jobs/${jobId}/transcript`,
        ...args,
      });
    },
    async cancelJob({
      jobId, ...args
    } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/jobs/${jobId}`,
        ...args,
      });
    },
    async getUsage(args = {}) {
      return this._makeRequest({
        path: "/usage",
        ...args,
      });
    },
    async getAccount(args = {}) {
      return this._makeRequest({
        path: "/me",
        ...args,
      });
    },
  },
};
