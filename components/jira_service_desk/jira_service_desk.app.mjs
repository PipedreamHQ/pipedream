import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "jira_service_desk",
  propDefinitions: {
    issueIdOrKey: {
      type: "string",
      label: "Issue ID or Key",
      description: "The ID or key of the issue",
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "The comment to be added to the customer request",
    },
    serviceDeskId: {
      type: "integer",
      label: "Service Desk ID",
      description: "The ID of the service desk",
    },
    requestTypeId: {
      type: "integer",
      label: "Request Type ID",
      description: "The ID of the request type",
    },
    requestFieldValues: {
      type: "object",
      label: "Request Field Values",
      description: "The values for the fields of the request",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.atlassian.com/ex/jira";
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    } = {}) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getCustomerRequests(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/rest/servicedeskapi/request",
      });
    },
    async createCustomerRequest({
      serviceDeskId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: `/rest/servicedeskapi/servicedesk/${serviceDeskId}/request`,
      });
    },
    async createRequestComment({
      issueIdOrKey, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: `/rest/servicedeskapi/request/${issueIdOrKey}/comment`,
      });
    },
  },
};
