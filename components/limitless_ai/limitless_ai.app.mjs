import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "limitless_ai",
  propDefinitions: {
    timezone: {
      type: "string",
      label: "Timezone",
      description: "Time zone identifier, e.g., UTC or America/New_York",
      optional: true,
    },
    date: {
      type: "string",
      label: "Date",
      description: "Specific date in ISO format: `YYYY-MM-DD`. If `start` or `end` are provided, `date` will be ignored",
    },
    start: {
      type: "string",
      label: "Start",
      description: "Start date or timestamp for the query range. ISO-8601 format: `YYYY-MM-DD` or `YYYY-MM-DD HH:mm:SS`",
      optional: true,
    },
    end: {
      type: "string",
      label: "End",
      description: "End date or timestamp for the query range. ISO-8601 format: `YYYY-MM-DD` or `YYYY-MM-DD HH:mm:SS`",
      optional: true,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Pagination cursor to fetch the next set of results",
      optional: true,
    },
    direction: {
      type: "string",
      label: "Direction",
      description: "Order of results",
      options: constants.DIRECTION_OPTIONS,
      optional: true,
    },
    includeMarkdown: {
      type: "boolean",
      label: "Include Markdown",
      description: "Whether to include Markdown-formatted content",
      optional: true,
    },
    includeHeadings: {
      type: "boolean",
      label: "Include Headings",
      description: "Whether to include document headings in the result",
      optional: true,
    },
    isStarred: {
      type: "boolean",
      label: "Is Starred",
      description: "Filter results by starred status",
      optional: true,
    },
    limit: {
      type: "string",
      label: "Limit",
      description: "Maximum number of results to return",
      optional: true,
    },
    id: {
      type: "string",
      label: "ID",
      description: "The ID of the lifelog entry to retrieve, given in the URL",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.limitless.ai/v1";
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
          "x-api-key": `${this.$auth.api_key}`,
          ...headers,
        },
      });
    },
    async getLifelogs(args = {}) {
      return this._makeRequest({
        path: "/lifelogs",
        ...args,
      });
    },
    async getLifelog({
      id, ...args
    }) {
      return this._makeRequest({
        path: `/lifelogs/${id}`,
        ...args,
      });
    },
  },
};
