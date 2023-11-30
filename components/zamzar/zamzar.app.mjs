import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zamzar",
  propDefinitions: {
    jobSource: {
      type: "string",
      label: "Job Source",
      description: "The source of the job to check for completion",
      optional: false,
    },
    fileType: {
      type: "string",
      label: "File Type",
      description: "The file type to convert the source file to",
      optional: false,
    },
    jobState: {
      type: "string",
      label: "Job State",
      description: "The state of the job to filter by",
      options: [
        "initialising",
        "converting",
        "successful",
        "failed",
        "cancelled",
      ],
      optional: true,
    },
    jobId: {
      type: "integer",
      label: "Job ID",
      description: "The unique identifier of the job",
      optional: false,
    },
    targetFormat: {
      type: "string",
      label: "Target Format",
      description: "The desired output format for the conversion",
      optional: false,
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content to create a PDF file from",
      optional: false,
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "The desired name for the created PDF file",
      optional: false,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.zamzar.com/v1";
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
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async startConversion({
      sourceFile, targetFormat, sourceFormat = null,
    }) {
      const data = {
        target_format: targetFormat,
        source_file: sourceFile,
      };
      if (sourceFormat) {
        data.source_format = sourceFormat;
      }

      return this._makeRequest({
        method: "POST",
        path: "/jobs",
        headers: {
          "Content-Type": "application/json",
        },
        data,
      });
    },
    async getJobStatus({ jobId }) {
      return this._makeRequest({
        path: `/jobs/${jobId}`,
      });
    },
    async convertToPDF({
      content, fileName,
    }) {
      // The content should be a URL or a path to a file, not the actual content
      return this.startConversion({
        sourceFile: content,
        targetFormat: "pdf",
      });
    },
    async findProcessedFile({ jobId }) {
      return this.getJobStatus({
        jobId,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
