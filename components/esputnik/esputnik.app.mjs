import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "esputnik",
  propDefinitions: {
    segment: {
      type: "string",
      label: "Segment",
      description: "Filter by segment",
      async options({ prevContext }) {
        const maxrows = constants.DEFAULT_PAGE_SIZE;
        const { startindex = 1 } = prevContext;
        const segments = await this.listSegments({
          params: {
            startindex,
            maxrows,
          },
        });
        return {
          options: segments.map((segment) => ({
            label: segment.name,
            value: segment.id,
          })),
          context: {
            startindex: startindex + maxrows,
          },
        };
      },
    },
    maxRequests: {
      type: "integer",
      min: 1,
      max: 180,
      label: "Max API Requests per Execution",
      description: "The maximum number of API requests to make per execution (e.g., multiple requests are required to retrieve paginated results).",
      optional: true,
      default: constants.DEFAULT_MAX_REQUESTS,
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://esputnik.com/api/v1/";
    },
    _getAuth() {
      return {
        username: "",
        password: this.$auth.api_key,
      };
    },
    async _makeRequest(args = {}) {
      const {
        method = "GET",
        path,
        $ = this,
        ...otherArgs
      } = args;
      const config = {
        method,
        url: `${this._getBaseUrl()}${path}`,
        auth: this._getAuth(),
        ...otherArgs,
      };
      return axios($, config);
    },
    async listSegments(args = {}) {
      return this._makeRequest({
        path: "groups",
        ...args,
      });
    },
    async listContacts(args = {}) {
      return this._makeRequest({
        path: "contacts",
        ...args,
      });
    },
    async listSegmentContacts({
      segmentId, ...args
    }) {
      return this._makeRequest({
        path: `group/${segmentId}/contacts`,
        ...args,
      });
    },
  },
};
