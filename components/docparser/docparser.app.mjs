import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "docparser",
  propDefinitions: {
    url: {
      type: "string",
      label: "Document URL",
      description: "The URL of the document to be fetched and imported into Docparser.",
    },
    file: {
      type: "string",
      label: "File Content",
      description: "The content of the file to be uploaded, encoded in base64.",
    },
    parserId: {
      type: "string",
      label: "Parser ID",
      description: "The ID of the parser to be used.",
      async options() {
        const parsers = await this.listParsers();
        return parsers.map((parser) => ({
          label: parser.name,
          value: parser.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.docparser.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
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
    async listParsers() {
      return this._makeRequest({
        path: "/v2/parsers",
      });
    },
    async fetchDocumentFromURL({
      parserId, url,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/v2/document/fetch/${parserId}`,
        data: {
          url,
        },
      });
    },
    async uploadDocument({
      parserId, file,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/v1/document/upload/${parserId}`,
        data: {
          file_content: file,
        },
      });
    },
    async pollParsedData() {
      // Implement logic to emit new events when parsed data is available
    },
    async pollParsedTableRows() {
      // Implement logic to emit new events when parsed table rows are available
    },
  },
  version: "0.0.{{{ts}}}", // Ensure the version is set as per requirements
};
