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
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL of the file to be processed.",
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to a file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
      optional: true,
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
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
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
