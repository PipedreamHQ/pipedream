import { axios } from "@pipedream/platform";
import fs from "fs";

export default {
  type: "app",
  app: "print_autopilot",
  propDefinitions: {
    pdfFilePath: {
      type: "string",
      label: "PDF File Path",
      description: "The file path for the PDF document to be uploaded",
    },
    priority: {
      type: "integer",
      label: "Priority",
      description: "The priority parameter to control the printing order",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.printautopilot.com";
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
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async uploadPdf({
      pdfFilePath, priority,
    }) {
      const formData = new FormData();
      formData.append("file", fs.createReadStream(pdfFilePath));
      if (priority) {
        formData.append("priority", priority);
      }
      return this._makeRequest({
        method: "POST",
        path: "/queue",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  },
};
