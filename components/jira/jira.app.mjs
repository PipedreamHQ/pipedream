import {
  ConfigurationError, axios,
} from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "jira",
  propDefinitions: {
    projectID: {
      type: "string",
      label: "Project ID",
      description: "The project ID",
      useQuery: true,
      async options({
        prevContext, query,
      }) {
        let { startAt } = prevContext || {};
        const pageSize = 50;
        const resp = await this.getAllProjects({
          params: {
            startAt,
            maxResults: pageSize,
            query,
          },
        });
        startAt = startAt > 0
          ? startAt + pageSize
          : pageSize;
        return {
          options: resp?.values.map((e) => ({
            label: e.name,
            value: e.id,
          })),
          context: {
            startAt,
          },
        };
      },
    },
    issueType: {
      type: "string",
      label: "Issue Type",
      description: "An ID identifying the type of issue. [Check the API docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/#api-rest-api-3-issue-post) to see available options",
      async options({
        projectId,
      }) {
        const issueTypes = isNaN(projectId)
          ? await this.getUserIssueTypes()
          : await this.getProjectIssueTypes({
            params: {
              projectId,
            },
          });
        return issueTypes.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    labels: {
      type: "string[]",
      label: "Labels",
      description: "Labels associated to the issue, such as \"bugfix\", \"blitz_test\".",
      optional: true,
      async options() {
        const resp = await this.getLabels();
        return resp?.values;
      },
    },
    issueIdOrKey: {
      type: "string",
      label: "Issue ID or Key",
      description: "The ID or key of an issue",
      async options({
        prevContext, tasksOnly = false,
      }) {
        let { startAt } = prevContext || {};
        const pageSize = 50;
        const jql = tasksOnly
          ? "project is not EMPTY AND issuetype = \"Task\" ORDER BY created DESC"
          : "project is not EMPTY ORDER BY created DESC";
        const resp = await this.searchIssues({
          params: {
            jql,
            startAt,
            maxResults: pageSize,
            fields: "id,key",
          },
        });
        startAt = startAt > 0
          ? startAt + pageSize
          : pageSize;
        return {
          options: resp?.issues?.map((issue) => ({
            value: issue.id,
            label: issue.key,
          })),
          context: {
            startAt,
          },
        };
      },
    },
    accountId: {
      type: "string",
      label: "Assignee ID",
      description: "The account ID of the user, which uniquely identifies the user across all Atlassian products, For example, `5b10ac8d82e05b22cc7d4ef5`",
      useQuery: true,
      async options({
        prevContext, query,
      }) {
        let { startAt } = prevContext || {};
        const pageSize = 50;
        const resp = await this.findUsers({
          params: {
            startAt,
            maxResults: pageSize,
            query,
          },
        });
        startAt = startAt > 0
          ? startAt + pageSize
          : pageSize;
        return {
          options: resp?.map((user) => ({
            value: user.accountId,
            label: user.displayName,
          })),
          context: {
            startAt,
          },
        };
      },
    },
    properties: {
      type: "string",
      label: "Properties",
      description: "A list of properties",
      optional: true,
    },
    expand: {
      type: "string",
      label: "Expand",
      description: "The Jira REST API uses resource expansion, which means that some parts of a resource are not returned unless specified in the request. This parameter accepts `renderedBody`, which returns the comment body rendered in HTML.",
      optional: true,
    },
    jqlFilter: {
      type: "string",
      label: "JQL Filter",
      description: "This is required for webhok creation",
    },
    additionalProperties: {
      type: "object",
      label: "Additional properties",
      description: "Extra properties of any type may be provided to this object",
      optional: true,
    },
    transition: {
      type: "string",
      label: "Transition",
      description: "Details of a transition. Required when performing a transition, optional when creating or editing an issue, See `Transition` section of [doc](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-put). Also you can go edit the workflow and choose the Text option instead of the Diagram option. You can see the transition ID in parenthesis.",
      optional: true,
      async options({
        prevContext, issueIdOrKey,
      }) {
        if (!issueIdOrKey) {
          return [];
        }
        let { startAt } = prevContext || {};
        const pageSize = 50;
        try {
          const resp = await this.getTransitions({
            issueIdOrKey,
            params: {
              startAt,
              maxResults: pageSize,
            },
          });
          startAt = startAt > 0
            ? startAt + pageSize
            : pageSize;
          return {
            options: resp?.transitions?.map((issue) => ({
              value: issue.id,
              label: issue.name,
            })),
            context: {
              startAt,
            },
          };
        } catch {
          return [];
        }
      },
    },
    fields: {
      type: "object",
      label: "Fields",
      description: "List of issue screen fields to update, specifying the sub-field to update and its value for each field. This field provides a straightforward option when setting a sub-field. When multiple sub-fields or other operations are required, use `update`. Fields included in here cannot be included in `update`. (.i.e for Fields \"fields\": {\"summary\":\"Completed orders still displaying in pending\",\"customfield_10010\":1,}) [see doc](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-put)",
      optional: true,
    },
    fieldId: {
      type: "string",
      label: "Field ID",
      description: "The ID of the field",
      useQuery: true,
      async options({
        query,
        prevContext: {
          hasMore,
          startAt = 0,
        },
        params = {
          type: [
            "custom",
            "system",
          ],
        },
      }) {
        if (hasMore === false) {
          return [];
        }

        const {
          isLast,
          values,
        } = await this.getFieldsPaginated({
          params: {
            ...params,
            query,
            maxResults: constants.DEFAULT_LIMIT,
            startAt,
          },
        });

        return {
          options: values.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            hasMore: !isLast,
            startAt: startAt + constants.DEFAULT_LIMIT,
          },
        };
      },
    },
    contextId: {
      type: "string",
      label: "Context ID",
      description: "The ID of the context",
      async options({
        prevContext: {
          hasMore,
          startAt = 0,
        },
        fieldId,
        params = {
          isAnyIssueType: true,
        },
      }) {
        if (hasMore === false) {
          return [];
        }

        const {
          isLast,
          values,
        } = await this.getCustomFieldContexts({
          fieldId,
          params: {
            ...params,
            startAt,
            maxResults: constants.DEFAULT_LIMIT,
          },
        });
        return {
          options: values.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            hasMore: !isLast,
            startAt: startAt + constants.DEFAULT_LIMIT,
          },
        };
      },
    },
    boardId: {
      type: "string",
      label: "Board ID",
      description: "The ID of the board",
      async options({
        prevContext,
      }) {
        let { startAt } = prevContext || {};
        const pageSize = 50;
        const resp = await this.listBoards({
          params: {
            startAt,
            maxResults: pageSize,
          },
        });
        startAt = startAt > 0
          ? startAt + pageSize
          : pageSize;
        return {
          options: resp?.values?.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })) ?? [],
          context: {
            startAt,
          },
        };
      },
    },
    sprintId: {
      type: "string",
      label: "Sprint ID",
      description: "The ID of the sprint",
      async options({
        prevContext, boardId,
      }) {
        if (!boardId) {
          return [];
        }
        let { startAt } = prevContext || {};
        const pageSize = 50;
        const resp = await this.listSprints({
          boardId,
          params: {
            startAt,
            maxResults: pageSize,
          },
        });
        startAt = startAt > 0
          ? startAt + pageSize
          : pageSize;
        return {
          options: resp?.values?.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })) ?? [],
          context: {
            startAt,
          },
        };
      },
    },
    epicId: {
      type: "string",
      label: "Epic ID",
      description: "The ID of the epic",
      async options({
        prevContext, boardId,
      }) {
        if (!boardId) {
          return [];
        }
        let { startAt } = prevContext || {};
        const pageSize = 50;
        const resp = await this.listEpics({
          boardId,
          params: {
            startAt,
            maxResults: pageSize,
          },
        });
        return {
          options: resp?.values?.map(({
            id: value, name, summary,
          }) => ({
            value,
            label: name || summary || value,
          })) ?? [],
          context: {
            startAt: startAt > 0
              ? startAt + pageSize
              : pageSize,
          },
        };
      },
    },
    commentId: {
      type: "string",
      label: "Comment ID",
      description: "The ID of the comment",
      async options({
        prevContext, issueIdOrKey,
      }) {
        if (!issueIdOrKey) {
          return [];
        }
        let { startAt } = prevContext || {};
        const pageSize = 50;
        try {
          const resp = await this.listIssueComments({
            issueIdOrKey,
            params: {
              startAt,
              maxResults: pageSize,
            },
          });
          startAt = startAt > 0
            ? startAt + pageSize
            : pageSize;
          return {
            options: resp?.comments?.map((comment) => ({
              value: comment.id,
              label: comment.body?.content[0]?.content[0]?.text || comment.id,
            })),
            context: {
              startAt,
            },
          };
        } catch {
          return [];
        }
      },
    },
  },
  methods: {
    /**
     * Returns the default headers for all Jira API requests, including authorization and content type.
     * @param {object} headers - Optional additional headers to merge in
     * @returns {object} The merged headers object
     */
    _getHeaders(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "user-agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    /**
     * Returns the base URL for Jira REST API v3 requests for the given cloud instance.
     * @param {string} cloudId - The Jira cloud ID
     * @returns {string} The base REST API URL
     */
    _getUrl(cloudId) {
      return `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3`;
    },
    /**
     * Returns the base URL for Jira Agile REST API requests for the given cloud instance.
     * @param {string} cloudId - The Jira cloud ID
     * @returns {string} The base Agile API URL
     */
    _getAgileUrl(cloudId) {
      return `https://api.atlassian.com/ex/jira/${cloudId}/rest/agile/1.0`;
    },
    /**
     * Resolves the Jira Cloud ID for the connected account and caches it for
     * the duration of the run. Most accounts have a single cloud instance, but
     * if multiple are found the first one is used and a log message lists all
     * available instances so the user can reconnect to a specific site if needed.
     * @returns {Promise<string>} The resolved cloud ID
     * @throws {ConfigurationError} If the cloud instances cannot be fetched or none are found
     */
    async _resolveCloudId() {
      if (this._cloudId) {
        return this._cloudId;
      }

      let clouds;
      try {
        clouds = await this.getClouds();
      } catch (err) {
        throw new ConfigurationError(`Unable to retrieve your Jira Cloud instance. Please check your connection. (${err.message})`);
      }

      if (!clouds?.length) {
        throw new ConfigurationError("No Jira Cloud instances found. Please reconnect your Jira account and confirm site access was granted.");
      }

      if (clouds.length > 1) {
        const names = clouds.map((c) => `"${c.name}"`).join(", ");
        console.log(`Multiple Jira Cloud instances found (${names}). Using "${clouds[0].name}" (${clouds[0].id}). To use a different instance, reconnect your Jira account scoped to that specific site.`);
      }

      this._cloudId = clouds[0].id;
      return this._cloudId;
    },
    /**
     * Makes an authenticated request to the Jira Agile API.
     * @param {object} args - Request options including path, headers, and optional cloudId override
     * @returns {Promise<object>} The API response
     */
    async _makeAgileRequest({
      $ = this, path, headers, cloudId, ...args
    } = {}) {
      return axios($, {
        url: `${this._getAgileUrl(cloudId ?? await this._resolveCloudId())}${path}`,
        headers: this._getHeaders(headers),
        ...args,
      });
    },
    /**
     * Makes an authenticated request to the Jira REST API. Accepts either a full
     * URL or a path, resolving the cloud ID automatically when using a path.
     * @param {object} args - Request options including url or path, headers, and optional cloudId override
     * @returns {Promise<object>} The API response
     */
    async _makeRequest({
      $ = this, url, path, headers, cloudId, ...args
    } = {}) {
      // When a full URL is provided (e.g. autocomplete endpoints) cloudId is
      // not needed; otherwise resolve it before building the path-based URL.
      const effectiveUrl = url ?? `${this._getUrl(cloudId ?? await this._resolveCloudId())}${path}`;
      return axios($, {
        url: effectiveUrl,
        headers: this._getHeaders(headers),
        ...args,
      });
    },
    /**
     * Registers a new Jira webhook for the given URL, events, and JQL filter.
     * @param {object} args - Hook options including url, events, and jqlFilter
     * @returns {Promise<object>} Object containing the created hookId
     */
    async createHook({
      url, events, jqlFilter,
    } = {}) {
      const response = await this._makeRequest({
        method: "POST",
        path: "/webhook",
        data: {
          url,
          webhooks: [
            {
              events,
              jqlFilter,
            },
          ],
        },
      });
      if (response?.webhookRegistrationResult[0]?.errors) {
        throw new ConfigurationError(`Cannot create the webhook trigger because Jira only allows one active webhook at a time. This is most likely because you have an existing Jira webhook running in another workflow. You can reuse your existing source in your workflow or deactivate the existing source and try again.

        Error detail:
        Could not create trigger(s). ${response.webhookRegistrationResult[0].errors}`);
      }
      return {
        hookId: response?.webhookRegistrationResult[0]?.createdWebhookId,
      };
    },
    /**
     * Deletes a Jira webhook by its ID.
     * @param {object} args - Object containing the hookId to delete
     * @returns {Promise<void>}
     */
    deleteHook({
      hookId,
    } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/webhook",
        data: {
          webhookIds: [
            hookId,
          ],
        },
      });
    },
    /**
     * Assigns an issue to a user.
     * @param {object} args - Object containing issueIdOrKey and assignment data
     * @returns {Promise<void>}
     */
    assignIssue({
      issueIdOrKey, ...args
    } = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/issue/${issueIdOrKey}/assignee`,
        ...args,
      });
    },
    /**
     * Adds a watcher to an issue.
     * @param {object} args - Object containing issueIdOrKey and accountId
     * @returns {Promise<void>}
     */
    addWatcher({
      issueIdOrKey, accountId, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/issue/${issueIdOrKey}/watchers`,
        data: `"${accountId}"`,
        ...args,
      });
    },
    /**
     * Adds an attachment to an issue.
     * @param {object} args - Object containing issueIdOrKey and attachment data
     * @returns {Promise<object>} The created attachment details
     */
    addAttachmentToIssue({
      issueIdOrKey, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/issue/${issueIdOrKey}/attachments`,
        ...args,
      });
    },
    /**
     * Adds a comment to an issue.
     * @param {object} args - Object containing issueIdOrKey and comment data
     * @returns {Promise<object>} The created comment
     */
    addCommentToIssue({
      issueIdOrKey, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/issue/${issueIdOrKey}/comment`,
        ...args,
      });
    },
    /**
     * Creates a new Jira issue.
     * @param {object} args - Issue creation data
     * @returns {Promise<object>} The created issue
     */
    createIssue(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/issue",
        ...args,
      });
    },
    /**
     * Creates a new version in a project.
     * @param {object} args - Version creation data
     * @returns {Promise<object>} The created version
     */
    createVersion({ ...args } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/version",
        ...args,
      });
    },
    /**
     * Deletes a project by its ID or key.
     * @param {object} args - Object containing projectIdOrKey
     * @returns {Promise<void>}
     */
    deleteProject({
      projectIdOrKey, ...args
    } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/project/${projectIdOrKey}`,
        ...args,
      });
    },
    /**
     * Returns a paginated list of projects matching the given search criteria.
     * @param {object} args - Query params such as query, maxResults, startAt
     * @returns {Promise<object>} Paginated project results
     */
    getAllProjects(args = {}) {
      return this._makeRequest({
        path: "/project/search",
        ...args,
      });
    },
    /**
     * Returns a paginated list of labels.
     * @param {object} args - Query params
     * @returns {Promise<object>} Paginated label results
     */
    getLabels(args = {}) {
      return this._makeRequest({
        path: "/label",
        ...args,
      });
    },
    /**
     * Returns a list of users matching the given search query.
     * @param {object} args - Query params such as query, maxResults, startAt
     * @returns {Promise<Array>} List of matching users
     */
    findUsers(args = {}) {
      return this._makeRequest({
        path: "/user/search",
        ...args,
      });
    },
    /**
     * Returns the details of a single issue.
     * @param {object} args - Object containing issueIdOrKey and optional field params
     * @returns {Promise<object>} The issue details
     */
    getIssue({
      issueIdOrKey, ...args
    } = {}) {
      return this._makeRequest({
        path: `/issue/${issueIdOrKey}`,
        ...args,
      });
    },
    /**
     * Searches for issues using JQL.
     * @param {object} args - Query params including jql, fields, maxResults, startAt
     * @returns {Promise<object>} Search results with issues array
     */
    searchIssues(args = {}) {
      return this._makeRequest({
        path: "/search/jql",
        ...args,
      });
    },
    /**
     * Returns the details of an async task.
     * @param {object} args - Object containing taskId
     * @returns {Promise<object>} Task details
     */
    getTask({
      taskId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/task/${taskId}`,
        ...args,
      });
    },
    /**
     * Returns the available transitions for an issue.
     * @param {object} args - Object containing issueIdOrKey
     * @returns {Promise<object>} Available transitions
     */
    getTransitions({
      issueIdOrKey, ...args
    } = {}) {
      return this._makeRequest({
        path: `/issue/${issueIdOrKey}/transitions`,
        ...args,
      });
    },
    /**
     * Returns the details of a single user.
     * @param {object} args - Query params such as accountId
     * @returns {Promise<object>} User details
     */
    getUser(args = {}) {
      return this._makeRequest({
        path: "/user",
        ...args,
      });
    },
    /**
     * Returns a paginated list of comments for an issue.
     * @param {object} args - Object containing issueIdOrKey and pagination params
     * @returns {Promise<object>} Paginated comments
     */
    listIssueComments({
      issueIdOrKey, ...args
    } = {}) {
      return this._makeRequest({
        path: `/issue/${issueIdOrKey}/comment`,
        ...args,
      });
    },
    /**
     * Transitions an issue to a new status.
     * @param {object} args - Object containing issueIdOrKey and transition data
     * @returns {Promise<void>}
     */
    transitionIssue({
      issueIdOrKey, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/issue/${issueIdOrKey}/transitions`,
        ...args,
      });
    },
    /**
     * Updates a comment on an issue.
     * @param {object} args - Object containing issueIdOrKey, commentId, and updated body
     * @returns {Promise<object>} The updated comment
     */
    updateComment({
      issueIdOrKey, commentId, ...args
    } = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/issue/${issueIdOrKey}/comment/${commentId}`,
        ...args,
      });
    },
    /**
     * Updates an issue, optionally applying a transition first.
     * @param {object} args - Object containing issueIdOrKey, optional transition, and field data
     * @returns {Promise<void>}
     */
    async updateIssue({
      issueIdOrKey, transition, ...args
    } = {}) {
      if (transition) {
        await this.transitionIssue({
          issueIdOrKey,
          data: {
            transition,
          },
        });
      }
      return this._makeRequest({
        method: "PUT",
        path: `/issue/${issueIdOrKey}`,
        ...args,
      });
    },
    /**
     * Returns the edit metadata for an issue, describing which fields can be updated.
     * @param {object} args - Object containing issueIdOrKey
     * @returns {Promise<object>} Edit metadata
     */
    getEditIssueMetadata({
      issueIdOrKey, ...args
    } = {}) {
      return this._makeRequest({
        path: `/issue/${issueIdOrKey}/editmeta`,
        ...args,
      });
    },
    /**
     * Returns metadata for creating issues, including available fields per issue type.
     * @param {object} args - Query params such as projectIds, issuetypeIds, expand
     * @returns {Promise<object>} Create issue metadata
     */
    getCreateIssueMetadata(args = {}) {
      return this._makeRequest({
        path: "/issue/createmeta",
        ...args,
      });
    },
    /**
     * Returns issue types available for a specific project.
     * @param {object} args - Query params including projectId
     * @returns {Promise<Array>} List of issue types
     */
    getProjectIssueTypes(args = {}) {
      return this._makeRequest({
        path: "/issuetype/project",
        ...args,
      });
    },
    /**
     * Returns all issue types visible to the current user.
     * @param {object} args - Optional query params
     * @returns {Promise<Array>} List of issue types
     */
    getUserIssueTypes(args = {}) {
      return this._makeRequest({
        path: "/issuetype",
        ...args,
      });
    },
    /**
     * Returns registered webhooks for the current app.
     * @param {object} args - Optional query params
     * @returns {Promise<object>} Paginated webhook results
     */
    getWebhook(args = {}) {
      return this._makeRequest({
        path: "/webhook",
        ...args,
      });
    },
    /**
     * Returns the list of Jira cloud instances accessible to the connected account.
     * @param {object} args - Optional request overrides
     * @returns {Promise<Array>} List of accessible cloud instances
     */
    getClouds(args = {}) {
      return axios(this, {
        url: "https://api.atlassian.com/oauth/token/accessible-resources",
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...args,
      });
    },
    /**
     * Returns a paginated list of fields matching the given search criteria.
     * @param {object} args - Query params such as type, query, maxResults, startAt
     * @returns {Promise<object>} Paginated field results
     */
    getFieldsPaginated(args = {}) {
      return this._makeRequest({
        path: "/field/search",
        ...args,
      });
    },
    /**
     * Returns the custom field contexts for a given field.
     * @param {object} args - Object containing fieldId and optional params
     * @returns {Promise<object>} Paginated context results
     */
    getCustomFieldContexts({
      fieldId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/field/${fieldId}/context`,
        ...args,
      });
    },
    /**
     * Returns an approximate count of issues matching the given JQL query.
     * @param {object} args - Request body containing the JQL query
     * @returns {Promise<object>} Approximate issue count
     */
    countIssuesUsingJQL(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/search/approximate-count",
        ...args,
      });
    },
    /**
     * Checks which issues in a list match the given JQL queries.
     * @param {object} args - Request body with issue IDs and JQL queries
     * @returns {Promise<object>} Match results per query
     */
    checkIssuesAgainstJQL(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/jql/match",
        ...args,
      });
    },
    /**
     * Searches for issues using JQL via POST (supports larger query payloads).
     * @param {object} args - Request body including jql, fields, maxResults, startAt
     * @returns {Promise<object>} Search results with issues array
     */
    postSearchIssues(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/search/jql",
        ...args,
      });
    },
    /**
     * Returns issue picker suggestions based on a search query.
     * @param {object} args - Query params such as query and currentJQL
     * @returns {Promise<object>} Issue picker suggestions
     */
    getIssuePickerSuggestions(args = {}) {
      return this._makeRequest({
        path: "/issue/picker",
        ...args,
      });
    },
    /**
     * Returns a paginated list of boards.
     * @param {object} args - Query params such as maxResults, startAt
     * @returns {Promise<object>} Paginated board results
     */
    listBoards(args = {}) {
      return this._makeAgileRequest({
        path: "/board",
        ...args,
      });
    },
    /**
     * Returns the details of a single board.
     * @param {object} args - Object containing boardId
     * @returns {Promise<object>} Board details
     */
    getBoard({
      boardId, ...args
    } = {}) {
      return this._makeAgileRequest({
        path: `/board/${boardId}`,
        ...args,
      });
    },
    /**
     * Returns a paginated list of issues on a board.
     * @param {object} args - Object containing boardId and pagination params
     * @returns {Promise<object>} Paginated issue results
     */
    listBoardIssues({
      boardId, ...args
    } = {}) {
      return this._makeAgileRequest({
        path: `/board/${boardId}/issue`,
        ...args,
      });
    },
    /**
     * Returns a paginated list of sprints for a board.
     * @param {object} args - Object containing boardId and pagination params
     * @returns {Promise<object>} Paginated sprint results
     */
    listSprints({
      boardId, ...args
    } = {}) {
      return this._makeAgileRequest({
        path: `/board/${boardId}/sprint`,
        ...args,
      });
    },
    /**
     * Returns the details of a single sprint.
     * @param {object} args - Object containing sprintId
     * @returns {Promise<object>} Sprint details
     */
    getSprint({
      sprintId, ...args
    } = {}) {
      return this._makeAgileRequest({
        path: `/sprint/${sprintId}`,
        ...args,
      });
    },
    /**
     * Returns a paginated list of issues in a sprint.
     * @param {object} args - Object containing sprintId and pagination params
     * @returns {Promise<object>} Paginated issue results
     */
    listSprintIssues({
      sprintId, ...args
    } = {}) {
      return this._makeAgileRequest({
        path: `/sprint/${sprintId}/issue`,
        ...args,
      });
    },
    /**
     * Moves issues into a sprint.
     * @param {object} args - Object containing sprintId and issue IDs
     * @returns {Promise<void>}
     */
    moveIssuesToSprint({
      sprintId, ...args
    } = {}) {
      return this._makeAgileRequest({
        method: "POST",
        path: `/sprint/${sprintId}/issue`,
        ...args,
      });
    },
    /**
     * Creates a new sprint on a board.
     * @param {object} args - Sprint creation data including name, startDate, endDate
     * @returns {Promise<object>} The created sprint
     */
    createSprint(args = {}) {
      return this._makeAgileRequest({
        method: "POST",
        path: "/sprint",
        ...args,
      });
    },
    /**
     * Returns a paginated list of epics on a board.
     * @param {object} args - Object containing boardId and pagination params
     * @returns {Promise<object>} Paginated epic results
     */
    listEpics({
      boardId, ...args
    } = {}) {
      return this._makeAgileRequest({
        path: `/board/${boardId}/epic`,
        ...args,
      });
    },
    /**
     * Returns a paginated list of issues belonging to an epic on a board.
     * @param {object} args - Object containing boardId, epicId, and pagination params
     * @returns {Promise<object>} Paginated issue results
     */
    listEpicIssues({
      boardId, epicId, ...args
    } = {}) {
      return this._makeAgileRequest({
        path: `/board/${boardId}/epic/${epicId}/issue`,
        ...args,
      });
    },
    /**
     * Async generator that pages through all resources returned by a given API function.
     * @param {object} options - Options object
     * @param {Function} options.resourceFn - The API method to call for each page
     * @param {object} options.resourceFnArgs - Arguments to pass to resourceFn on each call
     * @param {Function} options.resourceFiltererFn - Extracts the items array from each page response
     * @yields {object} Individual resource items across all pages
     */
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      resourceFiltererFn,
    }) {
      let page = 0;
      const pageSize = 50;
      while (true) {
        const nextResources = await resourceFn({
          ...resourceFnArgs,
          params: {
            ...resourceFnArgs.params,
            maxResults: pageSize,
            startAt: pageSize * page,
          },
        });
        if (!nextResources) {
          throw new Error("No response from Jira API.");
        }
        page += 1;
        const filteredResource = resourceFiltererFn(nextResources);
        for (const resource of filteredResource) {
          yield resource;
        }
        if (!nextResources.length) {
          return;
        }
      }
    },
  },
};
