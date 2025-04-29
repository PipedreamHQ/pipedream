import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "_2markdown",
  propDefinitions: {
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to an HTML file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.2markdown.com/v1";
    },
    _makeRequest({
      $ = this,
      path,
      headers,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "X-Api-Key": this.$auth.api_key,
        },
        ...opts,
      });
    },
    getJobStatus({
      jobId, ...opts
    }) {
      return this._makeRequest({
        path: `/pdf2md/${jobId}`,
        ...opts,
      });
    },
    pdfToMarkdown(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/pdf2md",
        ...opts,
      });
    },
    urlToMarkdown(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/url2md",
        ...opts,
      });
    },
    urlToMarkdownWithJs(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/url2mdjs",
        ...opts,
      });
    },
    htmlFileToMarkdown(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/file2md",
        ...opts,
      });
    },
    htmlToMarkdown(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/html2md",
        ...opts,
      });
    },
  },
};
