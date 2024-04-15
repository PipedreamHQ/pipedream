import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hansei",
  propDefinitions: {
    url: {
      type: "string",
      label: "Webpage URL",
      description: "The URL of the webpage you want to extract content from",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Additional information about the webpage",
      optional: true,
    },
    question: {
      type: "string",
      label: "Question",
      description: "The inquiry to get an answer for",
    },
    file: {
      type: "any",
      label: "File",
      description: "The file you want to upload to the knowledge base",
    },
    filetype: {
      type: "string",
      label: "File Type",
      description: "The type of the file (text, word, pdf)",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.hansei.app/public/v1";
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
          "X-API-KEY": this.$auth.api_key,
        },
      });
    },
    async addWebpageToKnowledgeBase({
      url, metadata,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/webpagesource",
        data: {
          url,
          metadata,
        },
      });
    },
    async getAnswerToQuestion({ question }) {
      return this._makeRequest({
        method: "POST",
        path: "/sendmessage",
        data: {
          question,
        },
      });
    },
    async uploadFileToKnowledgeBase({
      file, filetype,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/uploadsource",
        data: {
          file,
          filetype,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
