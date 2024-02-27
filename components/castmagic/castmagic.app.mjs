import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "castmagic",
  propDefinitions: {
    aiContentIdentification: {
      type: "string",
      label: "AI Content Identification",
      description: "Identification of the AI content to be pushed",
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "URL of the recording file to be imported",
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "Custom name for the file once it's imported",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.castmagic.io/v1";
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
          Authorization: `Bearer ${this.$auth.api_secret}`,
        },
      });
    },
    async emitAiContentEvent({ aiContentIdentification }) {
      return this._makeRequest({
        method: "POST",
        path: `/ai-content/${aiContentIdentification}`,
      });
    },
    async importRecordingFile({
      fileUrl, fileName,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/transcripts",
        data: {
          url: fileUrl,
          name: fileName,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
