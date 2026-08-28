import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

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
      description: "The ID or key of the Jira Service Desk request (e.g. `IT-42` or `10001`). Use **List My Requests** to find the `issueKey` of a request (in its `requests` array).",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: `Maximum number of items to return across all pages (${constants.MAX_RESULTS_MIN}-${constants.MAX_RESULTS_MAX}).`,
      optional: true,
      default: constants.MAX_RESULTS_DEFAULT,
      min: constants.MAX_RESULTS_MIN,
      max: constants.MAX_RESULTS_MAX,
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
    /**
     * Walks a paginated `servicedeskapi` collection until the API reports
     * `isLastPage`, or until `maxResults` items have been collected.
     *
     * @returns {Promise<{ results: object[], hasMore: boolean }>} the collected
     * items and whether the API still had more to give when collection stopped.
     */
    async paginate({
      $, path, params, maxResults = constants.MAX_RESULTS_DEFAULT,
    }) {
      const results = [];
      let start = 0;
      let isLastPage = false;

      while (results.length < maxResults) {
        const response = await this._makeRequest({
          $,
          path,
          params: {
            ...params,
            start,
            limit: Math.min(maxResults - results.length, constants.PAGE_SIZE),
          },
        });

        const values = response?.values;
        if (!values?.length) {
          isLastPage = true;
          break;
        }

        results.push(...values);
        isLastPage = Boolean(response.isLastPage);
        if (isLastPage) {
          break;
        }

        // The API may cap a page below the requested `limit`, so advance by what
        // was actually returned instead of by the requested page size.
        start += response.size || values.length;
      }

      return {
        results: results.slice(0, maxResults),
        hasMore: !isLastPage || results.length > maxResults,
      };
    },
    async getSites({ $ } = {}) {
      return this._makeRequest({
        $,
        path: "/oauth/token/accessible-resources",
      });
    },
    async getServiceDesks({
      $, cloudId,
    }) {
      const { results } = await this.paginate({
        $,
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/servicedesk`,
      });
      return results;
    },
    async getRequestTypes({
      $, cloudId, serviceDeskId,
    }) {
      const { results } = await this.paginate({
        $,
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/servicedesk/${serviceDeskId}/requesttype`,
      });
      return results;
    },
    async getRequestTypeFields({
      cloudId, serviceDeskId, requestTypeId,
    }) {
      const response = await this._makeRequest({
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/servicedesk/${serviceDeskId}/requesttype/${requestTypeId}/field`,
      });
      return response.requestTypeFields;
    },
    async getCustomerRequests({
      $, cloudId,
    }) {
      const { results } = await this.paginate({
        $,
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/request`,
      });
      return results;
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
    async getCurrentUser({ $ } = {}) {
      return this._makeRequest({
        $,
        path: "/me",
      });
    },
    async listMyRequests({
      $, cloudId, serviceDeskId, requestStatus, requestOwnership, maxResults,
    }) {
      const params = {
        requestStatus: requestStatus || "OPEN_REQUESTS",
        requestOwnership: requestOwnership || "OWNED_REQUESTS",
      };
      if (serviceDeskId) {
        params.serviceDeskId = serviceDeskId;
      }
      return this.paginate({
        $,
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/request`,
        params,
        maxResults,
      });
    },
    async getRequest({
      $, cloudId, issueIdOrKey,
    }) {
      return this._makeRequest({
        $,
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/request/${issueIdOrKey}`,
      });
    },
    async getRequestComments({
      $, cloudId, issueIdOrKey, maxResults,
    }) {
      return this.paginate({
        $,
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/request/${issueIdOrKey}/comment`,
        maxResults,
      });
    },
    async getRequestStatus({
      $, cloudId, issueIdOrKey, maxResults,
    }) {
      return this.paginate({
        $,
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/request/${issueIdOrKey}/status`,
        maxResults,
      });
    },
    async getRequestTransitions({
      $, cloudId, issueIdOrKey, maxResults,
    }) {
      return this.paginate({
        $,
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/request/${issueIdOrKey}/transition`,
        maxResults,
      });
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
