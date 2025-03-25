import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "autobound",
  propDefinitions: {
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "The email address of the contact the user is reaching out to",
    },
    userEmail: {
      type: "string",
      label: "User Email",
      description: "The email address of the user the content is written on behalf of",
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "Type of content to generate",
      options: constants.CONTENT_TYPES,
    },
    writingStyle: {
      type: "string",
      label: "Writing Style",
      description: "Writing style for content generation",
      options: constants.WRITING_STYLES,
    },
    additionalContext: {
      type: "string",
      label: "Additional Context",
      description: "Extra information for customizing generated content",
    },
    wordCount: {
      type: "integer",
      label: "Word Count",
      description: "Approximate word count for output",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.autobound.ai/api/external";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          "X-API-KEY": `${this.$auth.api_key}`,
          "Content-Type": "application/json",
          ...headers,
        },
      });
    },
    async writePersonalizedContent(args = {}) {
      return this._makeRequest({
        path: "/generate-content/v3.5",
        method: "post",
        ...args,
      });
    },
  },
};
