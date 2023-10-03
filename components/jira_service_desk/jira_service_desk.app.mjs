import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "jira_service_desk",
  propDefinitions: {
    cloudId: {
      type: "string",
      label: "Cloud ID",
      description: "Select a site, or provide a custom ID.",
      async options() {
        const sites = await this.getSites();
        return sites?.filter?.(({ scopes }) => scopes?.includes("write:servicedesk-request")).map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    serviceDeskId: {
      type: "string",
      label: "Service Desk ID",
      description: "Select a service desk, or provide a custom ID.",
      async options() {
        const desks = await this.getServiceDesks();
        return desks?.map?.(({
          id, projectName,
        }) => ({
          label: projectName,
          value: id,
        }));
      },
    },
    requestId: {
      type: "string",
      label: "Request ID",
      description: "Select a request, or provide a custom ID.",
      async options() {
        const requests = await this.getCustomerRequests();
        return requests?.map?.(({
          issueId, issueKey,
        }) => ({
          label: issueKey,
          value: issueId,
        }));
      },
    },
    requestTypeId: {
      type: "string",
      label: "Request Type ID",
      description: "Select a request type, or provide a custom ID.",
      async options({ serviceDeskId }) {
        const types = await this.getRequestTypes(serviceDeskId);
        return types?.map?.(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.atlassian.com";
    },
    async _makeRequest({
      $ = this, path, headers, ...otherOpts
    } = {}) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getSites() {
      return this._makeRequest({
        path: "/oauth/token/accessible-resources",
      });
    },
    async getServiceDesks() {
      const response = await this._makeRequest({
        path: "ex/jira/rest/servicedeskapi/servicedesk",
      });
      return response.values;
    },
    async getRequestTypes(serviceDeskId) {
      const response = await this._makeRequest({
        path: `ex/jira/rest/servicedeskapi/servicedesk/${serviceDeskId}/requesttype`,
      });
      return response.values;
    },
    async getCustomerRequests(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "ex/jira/rest/servicedeskapi/request",
      });
    },
    async createCustomerRequest({
      serviceDeskId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: `ex/jira/rest/servicedeskapi/servicedesk/${serviceDeskId}/request`,
      });
    },
    async createRequestComment({
      requestId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: `ex/jira/rest/servicedeskapi/request/${requestId}/comment`,
      });
    },
  },
};
