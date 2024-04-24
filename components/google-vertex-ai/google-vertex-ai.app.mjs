import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "vertex_ai",
  propDefinitions: {
    text: {
      type: "string",
      label: "Text",
      description: "The content to analyze or classify",
    },
    resource: {
      type: "string",
      label: "Resource",
      description: "The source of the material (images or videos) to be analyzed",
    },
    instructions: {
      type: "string",
      label: "Instructions",
      description: "The rules for analysis of the input images and videos",
    },
  },
  methods: {
    _baseUrl() {
      return "https://aiplatform.googleapis.com/v1";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async analyzeSentiment({ text }) {
      return this._makeRequest({
        method: "POST",
        path: "/projects/locations/publishers/models:analyzeSentiment",
        data: {
          text,
        },
      });
    },
    async classifyText({ text }) {
      return this._makeRequest({
        method: "POST",
        path: "/projects/locations/publishers/models:classifyText",
        data: {
          text,
        },
      });
    },
    async analyzeResource({
      resource, instructions,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/projects/locations/publishers/models:analyzeResource",
        data: {
          resource,
          instructions,
        },
      });
    },
  },
};
