import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "intellexer_api",
  propDefinitions: {
    structure: {
      type: "string",
      label: "Structure",
      description: "Specify structure of the document / text",
      options: [
        "NewsArticle",
        "ResearchPaper",
        "Patent",
        "General",
      ],
    },
    loadConceptsTree: {
      type: "boolean",
      label: "Load Concepts Tree",
      description: "Load a tree of concepts. Default: true",
      default: true,
      optional: true,
    },
    loadNamedEntityTree: {
      type: "boolean",
      label: "Load Named Entity Tree",
      description: "Load a tree of Named Entities. Default: true",
      default: true,
      optional: true,
    },
    summaryRestriction: {
      type: "integer",
      label: "Summary Restriction",
      description: "Determine size of a summary measured in sentences. Required for `items` to be included in the response.",
      optional: true,
    },
    returnedTopicsCount: {
      type: "integer",
      label: "Returned Topics Count",
      description: "Determine max count of text topics to return",
      optional: true,
    },
    fullTextTrees: {
      type: "boolean",
      label: "Full Text Trees",
      description: "Set to true to load full text trees",
      optional: true,
    },
    wrapConcepts: {
      type: "boolean",
      label: "Wrap Concepts",
      description: "Mark concepts found in the summary with HTML bold tags. Default: false",
      default: false,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "http://api.intellexer.com";
    },
    _authParams(params = {}) {
      return {
        ...params,
        apikey: `${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      params,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: this._authParams(params),
        ...args,
      });
    },
    summarizeDocument(args = {}) {
      return this._makeRequest({
        path: "/summarize",
        ...args,
      });
    },
    summarizeText(args = {}) {
      return this._makeRequest({
        path: "/summarizeText",
        method: "POST",
        ...args,
      });
    },
    extractNamedEntities(args = {}) {
      return this._makeRequest({
        path: "/recognizeNe",
        ...args,
      });
    },
    recognizeLanguage(args = {}) {
      return this._makeRequest({
        path: "/recognizeLanguage",
        method: "POST",
        ...args,
      });
    },
  },
};
