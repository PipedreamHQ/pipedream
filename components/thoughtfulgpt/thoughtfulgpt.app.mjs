import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "thoughtfulgpt",
  propDefinitions: {
    content: {
      type: "string",
      label: "Content",
      description: "The content to be processed",
    },
    macro: {
      type: "string",
      label: "Macro",
      description: "The macro to process the content",
    },
    csvFile: {
      type: "string",
      label: "CSV File",
      description: "The CSV file to be analyzed",
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.thoughtfulgpt.com/api";
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
          "Authorization": this.$auth.api_token,
        },
      });
    },
    async processContent({
      content, macro,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/automations/zapier/webhook/transcript/",
        data: {
          content: content,
          macro: macro,
        },
      });
    },
    async analyzeCSV({ csvFile }) {
      return this._makeRequest({
        method: "POST",
        path: "/automations/zapier/webhook/process-csv/",
        data: {
          file: csvFile,
        },
      });
    },
  },
};
