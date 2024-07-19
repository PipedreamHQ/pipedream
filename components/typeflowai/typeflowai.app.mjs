import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "typeflowai",
  propDefinitions: {
    workflowId: {
      type: "string",
      label: "Workflow ID",
      description: "The ID of the workflow",
      required: true,
    },
    responseId: {
      type: "string",
      label: "Response ID",
      description: "The ID of the response",
      required: true,
    },
    markedBy: {
      type: "string",
      label: "Marked By",
      description: "The ID of the user or system that marked the response as finished",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.typeflowai.com";
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
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async createResponse(workflowId, data) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/client/responses",
        data: {
          workflowId,
          data,
          finished: false,
        },
      });
    },
    async updateResponse(workflowId, responseId, data) {
      return this._makeRequest({
        method: "PUT",
        path: `/v1/client/responses/${responseId}`,
        data: {
          workflowId,
          data,
        },
      });
    },
    async markResponseAsFinished(responseId, data, markedBy) {
      return this._makeRequest({
        method: "PUT",
        path: `/v1/client/responses/${responseId}`,
        data: {
          ...data,
          finished: true,
          markedBy,
        },
      });
    },
  },
};
