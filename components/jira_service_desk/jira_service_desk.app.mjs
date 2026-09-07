import {
  axios, getFileStreamAndMetadata,
} from "@pipedream/platform";
import FormData from "form-data";
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
    query: {
      type: "string",
      label: "Query",
      description: "Name or email address to search for, e.g. `Joseph Wilson` or `joseph@example.com`. Matched against `displayName` and `emailAddress`. A full name or full email address gives the tightest result set.",
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
      $, path, params, headers, maxResults = constants.MAX_RESULTS_DEFAULT,
    }) {
      const results = [];
      let start = 0;
      let isLastPage = false;

      while (results.length < maxResults) {
        const response = await this._makeRequest({
          $,
          path,
          headers,
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
    // Site-wide user search. Returns a bare array, not the `values`/`isLastPage`
    // envelope `_paginate` expects, so it pages by offset here instead.
    async searchUsers({
      $, cloudId, query, maxResults = constants.MAX_RESULTS_DEFAULT,
    }) {
      const results = [];
      let startAt = 0;
      // One row past the cap separates "cap equals match count" from "more exist".
      const ceiling = maxResults + 1;

      while (results.length < ceiling) {
        const limit = Math.min(
          ceiling - results.length,
          constants.USER_SEARCH_PAGE_SIZE,
        );
        const users = await this._makeRequest({
          $,
          path: `/ex/jira/${cloudId}/rest/api/3/user/search`,
          params: {
            query,
            startAt,
            maxResults: limit,
          },
        });

        // Only an empty page ends it: a short page may just be a clamped page.
        if (!users?.length) {
          break;
        }

        results.push(...users);
        startAt += users.length;
      }

      return {
        results: results.slice(0, maxResults),
        hasMore: results.length > maxResults,
      };
    },
    async searchServiceDeskCustomers({
      $, cloudId, serviceDeskId, query, maxResults,
    }) {
      return this._paginate({
        $,
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/servicedesk/${serviceDeskId}/customer`,
        params: {
          query,
        },
        headers: constants.EXPERIMENTAL_API_HEADER,
        maxResults,
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
        content: _links?.content,
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
    async uploadTemporaryFile({
      cloudId, serviceDeskId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/servicedesk/${serviceDeskId}/attachTemporaryFile`,
      });
    },
    async attachFilesToRequest({
      cloudId, issueIdOrKey, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: `/ex/jira/${cloudId}/rest/servicedeskapi/request/${issueIdOrKey}/attachment`,
      });
    },
    async deleteAttachment({
      cloudId, attachmentId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "DELETE",
        path: `/ex/jira/${cloudId}/rest/api/3/attachment/${attachmentId}`,
      });
    },
    /**
     * Uploads one or more local/remote files as temporary attachments scoped
     * to `serviceDeskId`, then attaches them to `issueIdOrKey`. Two-step dance
     * required by the JSM API: a file can't be attached to a request directly.
     */
    async attachFilesToRequestFromSource({
      $, cloudId, serviceDeskId, issueIdOrKey, files, isPublic,
    }) {
      // Uploaded one file at a time (rather than buffering every file into one shared
      // FormData first) so only the small temporaryAttachmentId is retained across
      // iterations instead of holding every file's full content in memory at once.
      const temporaryAttachmentIds = [];
      for (const file of files) {
        const {
          stream, metadata,
        } = await getFileStreamAndMetadata(file);
        // Buffered rather than piped as a live stream: attachTemporaryFile consistently
        // 500'd at the Atlassian edge when the multipart body was a live Readable (verified
        // against the JSM API directly), even with Content-Length set from a known size.
        const chunks = [];
        for await (const chunk of stream) {
          chunks.push(chunk);
        }
        const data = new FormData();
        data.append("file", Buffer.concat(chunks), {
          contentType: metadata.contentType,
          filename: metadata.name,
        });

        const uploadResponse = await this.uploadTemporaryFile({
          $,
          cloudId,
          serviceDeskId,
          headers: {
            "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
            "Content-Length": data.getLengthSync(),
            "X-Atlassian-Token": "no-check",
          },
          data,
        });
        temporaryAttachmentIds.push(
          ...uploadResponse.temporaryAttachments.map(
            ({ temporaryAttachmentId }) => temporaryAttachmentId,
          ),
        );
      }

      return this.attachFilesToRequest({
        $,
        cloudId,
        issueIdOrKey,
        data: {
          temporaryAttachmentIds,
          public: isPublic ?? true,
        },
      });
    },
  },
};
