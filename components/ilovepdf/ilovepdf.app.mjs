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
    fileUrls: {
      type: "string[]",
      label: "File URLs",
      description: "The URL(s) of the file(s) to be processed.",
      optional: true,
    },
    filePaths: {
      type: "string[]",
      label: "File Paths",
      description: "The path(s) to file(s) in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
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
      return "api.ilovepdf.com";
    },
    async _makeRequest({
      $ = this,
      path,
      server,
      headers,
      token,
      ...args
    }) {
      return axios($, {
        ...args,
        url: `https://${server ?? this._baseUrl()}/v1` + path,
        headers: {
          ...headers,
          ...(token && {
            Authorization: `Bearer ${token}`,
          }),
        },
      });
    },
    async getAuthToken(args) {
      return this._makeRequest({
        ...args,
        method: "POST",
        path: "/auth",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          public_key: this.$auth.public_key,
        },
      });
    },
    async startTask({
      tool, ...args
    }) {
      return this._makeRequest({
        path: `/start/${tool}`,
        ...args,
      });
    },
    async uploadFile(args) {
      return this._makeRequest({
        method: "POST",
        path: "/upload",
        ...args,
      });
    },
    async processFiles(args) {
      return this._makeRequest({
        method: "POST",
        path: "/process",
        ...args,
      });
    },
    async downloadFiles({
      task, ...args
    }) {
      return this._makeRequest({
        path: `/download/${task}`,
        ...args,
      });
    },
  },
};
