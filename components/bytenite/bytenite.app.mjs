import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bytenite",
  propDefinitions: {
    videoLink: {
      type: "string",
      label: "Video Link",
      description: "Link to the original video file",
      optional: false,
    },
    encodingQuality: {
      type: "string",
      label: "Encoding Quality",
      description: "Optional encoding quality settings",
      optional: true,
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of the video encoding job",
      optional: false,
    },
    outputFormat: {
      type: "string",
      label: "Output Format",
      description: "Desired format of the video file",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.bytenite.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createVideoEncodingTask(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/jobs",
        data: {
          input: this.videoLink,
          encodingQuality: this.encodingQuality,
        },
        ...opts,
      });
    },
    async initiateVideoEncodingJob(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/jobs/${this.jobId}/run`,
        ...opts,
      });
    },
    async secureOutputLink(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: `/jobs/${this.jobId}/results`,
        params: {
          format: this.outputFormat,
        },
        ...opts,
      });
    },
  },
};
