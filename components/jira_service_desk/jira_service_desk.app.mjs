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
      async options({ cloudId }) {
        const desks = await this.getServiceDesks({
          cloudId,
        });
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
      async options({ cloudId }) {
        const requests = await this.getCustomerRequests({
          cloudId,
        });
        return requests?.map?.(({
          issueId, issueKey, requestFieldValues,
        }) => {
          const summary = requestFieldValues?.find?.(({ fieldId }) => fieldId === "summary")?.value;
          return ({
            label: `(${issueKey}) ${summary}`,
            value: issueId,
          });
        });
      },
    },
    requestTypeId: {
      type: "string",
      label: "Request Type ID",
      description: "Select a request type, or provide a custom ID.",
      async options({
        cloudId, serviceDeskId,
      }) {
        const types = await this.getRequestTypes({
          cloudId,
          serviceDeskId,
        });
        return types?.map?.(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    issueIdOrKey: {
      type: "string",
      label: "Issue ID or Key",
      description: "The ID or key of the Jira Service Desk request (e.g. `IT-42` or `10001`). Use **List My Requests** to find the `issueKey` of a request.",
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
    async getServiceDesks({ cloudId }) {
      const response = await this._makeRequest({
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/servicedesk`,
      });
      return response.values;
    },
    async getRequestTypes({
      cloudId, serviceDeskId,
    }) {
      const response = await this._makeRequest({
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/servicedesk/${serviceDeskId}/requesttype`,
      });
      return response.values;
    },
    async getRequestTypeFields({
      cloudId, serviceDeskId, requestTypeId,
    }) {
      const response = await this._makeRequest({
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/servicedesk/${serviceDeskId}/requesttype/${requestTypeId}/field`,
      });
      return response.requestTypeFields;
    },
    async getCustomerRequests({ cloudId }) {
      const response = await this._makeRequest({
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/request`,
      });
      return response.values;
    },
    async createCustomerRequest({
      cloudId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/request`,
      });
    },
    async createRequestComment({
      cloudId, requestId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/request/${requestId}/comment`,
      });
    },
    async getCurrentUser() {
      return this._makeRequest({
        path: "/me",
      });
    },
    async listMyRequests({
      cloudId, serviceDeskId, requestStatus, requestOwnership,
    }) {
      const params = {
        requestStatus: requestStatus || "OPEN_REQUESTS",
        requestOwnership: requestOwnership || "OWNED_REQUESTS",
      };
      if (serviceDeskId) params.serviceDeskId = serviceDeskId;
      const response = await this._makeRequest({
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/request`,
        params,
      });
      return response.values;
    },
    async getRequest({
      cloudId, issueIdOrKey,
    }) {
      return this._makeRequest({
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/request/${issueIdOrKey}`,
      });
    },
    async getRequestComments({
      cloudId, issueIdOrKey,
    }) {
      const response = await this._makeRequest({
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/request/${issueIdOrKey}/comment`,
      });
      return response.values;
    },
    async getRequestStatus({
      cloudId, issueIdOrKey,
    }) {
      const response = await this._makeRequest({
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/request/${issueIdOrKey}/status`,
      });
      return response.values;
    },
    async getRequestTransitions({
      cloudId, issueIdOrKey,
    }) {
      const response = await this._makeRequest({
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/request/${issueIdOrKey}/transition`,
      });
      return response.values;
    },
    async transitionRequest({
      cloudId, issueIdOrKey, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/request/${issueIdOrKey}/transition`,
      });
    },
    async updateIssueFields({
      cloudId, issueIdOrKey, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "PUT",
        path: `/ex/jira/${cloudId}/rest/api/3/issue/${issueIdOrKey}`,
      });
    },
  },
};
