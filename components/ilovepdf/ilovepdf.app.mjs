import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ilovepdf",
  propDefinitions: {
    filePaths: {
      type: "string[]",
      label: "File Paths or URLs",
      description: "The files to process. For each entry, provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.pdf`)",
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
    async getAuthToken(args = {}) {
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
    async listTasks({
      tool, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/task",
        data: {
          tool,
          secret_key: this.$auth.secret_key,
        },
        ...args,
      });
    },
  },
};
