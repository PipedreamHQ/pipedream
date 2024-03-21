import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cloud_convert",
  propDefinitions: {
    inputFile: {
      type: "string",
      label: "Input File",
      description: "The input file to be converted.",
    },
    outputFormat: {
      type: "string",
      label: "Output Format",
      description: "The format to convert the input file to.",
    },
    filesToArchive: {
      type: "string[]",
      label: "Files to Archive",
      description: "The files to be included in the archive.",
    },
    archiveFormat: {
      type: "string",
      label: "Archive Format",
      description: "The archive format to create (e.g., zip, rar, 7z, tar).",
    },
    inputFiles: {
      type: "string[]",
      label: "Input Files",
      description: "The input files to be combined into a single PDF file.",
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The job ID for identifying the job.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.cloudconvert.com/v2";
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
    async createJob(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/jobs",
        headers: {
          "Content-Type": "application/json",
        },
        data: opts,
      });
    },
    async getJobStatus(jobId) {
      return this._makeRequest({
        path: `/jobs/${jobId}`,
      });
    },
    async downloadExportedFile(url) {
      return this._makeRequest({
        method: "GET",
        url, // Direct file URL
        responseType: "stream",
      });
    },
    async createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        headers: {
          "Content-Type": "application/json",
        },
        data: opts,
      });
    },
    async listWebhooks() {
      return this._makeRequest({
        path: "/webhooks",
      });
    },
    async deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
    async createConvertTask(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/convert",
        headers: {
          "Content-Type": "application/json",
        },
        data: opts,
      });
    },
    async createMergeTask(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/merge",
        headers: {
          "Content-Type": "application/json",
        },
        data: opts,
      });
    },
    async createArchiveTask(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/archive",
        headers: {
          "Content-Type": "application/json",
        },
        data: opts,
      });
    },
    async emitEvent(eventType, payload) {
      // This method is a placeholder for event emission logic
      // The actual implementation will depend on how CloudConvert
      // events are received and handled within the Pipedream platform
      console.log(`Emitting event of type: ${eventType}`, payload);
    },
  },
  version: "0.0.{{ts}}",
};
