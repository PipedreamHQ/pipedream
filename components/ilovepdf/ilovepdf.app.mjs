import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ilovepdf",
  propDefinitions: {
    task: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task",
    },
    file: {
      type: "string",
      label: "File",
      description: "The file to be processed",
    },
    tool: {
      type: "string",
      label: "Tool",
      description: "The tool to be used for the operation",
      options: [
        "compress",
        "merge",
        "split",
        "pdfjpg",
        "imagepdf",
        "unlock",
        "pagenumber",
        "watermark",
        "officepdf",
        "repair",
        "rotate",
        "protect",
        "pdfa",
        "validatepdfa",
        "htmlpdf",
        "extract",
      ],
    },
    serverFilename: {
      type: "string",
      label: "Server Filename",
      description: "The server filename of the uploaded file",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.ilovepdf.com/v1";
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
    async startTask({ tool }) {
      return this._makeRequest({
        method: "GET",
        path: `/start/${tool}`,
      });
    },
    async uploadFile({
      task, file,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/upload",
        data: {
          task,
          file,
        },
      });
    },
    async processFiles({
      task, tool, serverFilename,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/process",
        data: {
          task,
          tool,
          files: [
            {
              server_filename: serverFilename,
            },
          ],
        },
      });
    },
    async downloadFiles({ task }) {
      return this._makeRequest({
        method: "GET",
        path: `/download/${task}`,
      });
    },
  },
};
