// x-pd-ai: optimized
import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "jira_service_desk",
  propDefinitions: {
    cloudId: {
      type: "string",
      label: "Cloud ID",
      description: "The Atlassian site (cloud) ID, e.g. `822faf0d-5427-420e-9016-999d3dc76918`. Run **List Sites** to get the `id` of every site you can access.",
    },
    serviceDeskId: {
      type: "string",
      label: "Service Desk ID",
      description: "The numeric ID of the service desk, e.g. `1`. Run **List Service Desks** to find it from a project name or key.",
    },
    requestId: {
      type: "string",
      label: "Request ID",
      description: "The `issueId` of the customer request, e.g. `10288`. Run **List My Requests** to find it.",
    },
    requestTypeId: {
      type: "string",
      label: "Request Type ID",
      description: "The numeric ID of the request type, e.g. `4`. Run **List Request Types** to see what a service desk offers and pick the type matching the user's intent.",
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
    expand: {
      type: "string[]",
      label: "Expand",
      description: "Additional data to include in the response, as a list of expansion names (e.g. `[\"field\"]`). Valid values differ per endpoint and are listed in the `_expands` property of that endpoint's response. Unrecognised names are ignored silently rather than rejected.",
      optional: true,
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
    async _paginate({
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
      $, cloudId, maxResults,
    }) {
      return this._paginate({
        $,
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/servicedesk`,
        maxResults,
      });
    },
    async getRequestTypes({
      $, cloudId, serviceDeskId, params, maxResults,
    }) {
      return this._paginate({
        $,
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/servicedesk/${serviceDeskId}/requesttype`,
        params,
        maxResults,
      });
    },
    async getRequestTypeCreateMeta({
      $, cloudId, serviceDeskId, requestTypeId, params,
    }) {
      return this._makeRequest({
        $,
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/servicedesk/${serviceDeskId}/requesttype/${requestTypeId}/field`,
        params,
      });
    },
    async getCustomerRequests({
      $, cloudId,
    }) {
      const { results } = await this._paginate({
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
      return this._paginate({
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
      return this._paginate({
        $,
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/request/${issueIdOrKey}/comment`,
        maxResults,
      });
    },
    async getRequestStatus({
      $, cloudId, issueIdOrKey, maxResults,
    }) {
      return this._paginate({
        $,
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/request/${issueIdOrKey}/status`,
        maxResults,
      });
    },
    async getRequestTransitions({
      $, cloudId, issueIdOrKey, maxResults,
    }) {
      return this._paginate({
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
    async getIssueAttachments({
      $, cloudId, issueIdOrKey, maxResults,
    }) {
      const {
        results, hasMore,
      } = await this._paginate({
        $,
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/request/${issueIdOrKey}/attachment`,
        maxResults,
      });
      const attachments = results.map(({
        filename, size, mimeType, _links,
      }) => ({
        id: _links?.jiraRest?.split("/").pop(),
        filename,
        size,
        mimeType,
      }));
      return {
        attachments,
        hasMore,
      };
    },
    async getAttachmentContent({
      $, cloudId, issueIdOrKey, attachmentId,
    }) {
      return this._makeRequest({
        $,
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/request/${issueIdOrKey}/attachment/${attachmentId}`,
        responseType: constants.STREAM_RESPONSE_TYPE,
      });
    },
  },
};
