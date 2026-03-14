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
    _getHeaders(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "user-agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    _getUrl(cloudId) {
      return `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3`;
    },
    _getAgileUrl(cloudId) {
      return `https://api.atlassian.com/ex/jira/${cloudId}/rest/agile/1.0`;
    },
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
    async _makeAgileRequest({
      $ = this, path, headers, cloudId, ...args
    } = {}) {
      return axios($, {
        url: `${this._getAgileUrl(cloudId ?? await this._resolveCloudId())}${path}`,
        headers: this._getHeaders(headers),
        ...args,
      });
    },
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
    assignIssue({
      issueIdOrKey, ...args
    } = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/issue/${issueIdOrKey}/assignee`,
        ...args,
      });
    },
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
    addAttachmentToIssue({
      issueIdOrKey, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/issue/${issueIdOrKey}/attachments`,
        ...args,
      });
    },
    addCommentToIssue({
      issueIdOrKey, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/issue/${issueIdOrKey}/comment`,
        ...args,
      });
    },
    createIssue(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/issue",
        ...args,
      });
    },
    createVersion({ ...args } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/version",
        ...args,
      });
    },
    deleteProject({
      projectIdOrKey, ...args
    } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/project/${projectIdOrKey}`,
        ...args,
      });
    },
    getAllProjects(args = {}) {
      return this._makeRequest({
        path: "/project/search",
        ...args,
      });
    },
    getLabels(args = {}) {
      return this._makeRequest({
        path: "/label",
        ...args,
      });
    },
    findUsers(args = {}) {
      return this._makeRequest({
        path: "/user/search",
        ...args,
      });
    },
    getIssue({
      issueIdOrKey, ...args
    } = {}) {
      return this._makeRequest({
        path: `/issue/${issueIdOrKey}`,
        ...args,
      });
    },
    searchIssues(args = {}) {
      return this._makeRequest({
        path: "/search/jql",
        ...args,
      });
    },
    getTask({
      taskId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/task/${taskId}`,
        ...args,
      });
    },
    getTransitions({
      issueIdOrKey, ...args
    } = {}) {
      return this._makeRequest({
        path: `/issue/${issueIdOrKey}/transitions`,
        ...args,
      });
    },
    getUser(args = {}) {
      return this._makeRequest({
        path: "/user",
        ...args,
      });
    },
    listIssueComments({
      issueIdOrKey, ...args
    } = {}) {
      return this._makeRequest({
        path: `/issue/${issueIdOrKey}/comment`,
        ...args,
      });
    },
    transitionIssue({
      issueIdOrKey, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/issue/${issueIdOrKey}/transitions`,
        ...args,
      });
    },
    updateComment({
      issueIdOrKey, commentId, ...args
    } = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/issue/${issueIdOrKey}/comment/${commentId}`,
        ...args,
      });
    },
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
    getEditIssueMetadata({
      issueIdOrKey, ...args
    } = {}) {
      return this._makeRequest({
        path: `/issue/${issueIdOrKey}/editmeta`,
        ...args,
      });
    },
    getCreateIssueMetadata(args = {}) {
      return this._makeRequest({
        path: "/issue/createmeta",
        ...args,
      });
    },
    getProjectIssueTypes(args = {}) {
      return this._makeRequest({
        path: "/issuetype/project",
        ...args,
      });
    },
    getUserIssueTypes(args = {}) {
      return this._makeRequest({
        path: "/issuetype",
        ...args,
      });
    },
    getWebhook(args = {}) {
      return this._makeRequest({
        path: "/webhook",
        ...args,
      });
    },
    getClouds(args = {}) {
      return axios(this, {
        url: "https://api.atlassian.com/oauth/token/accessible-resources",
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...args,
      });
    },
    getFieldsPaginated(args = {}) {
      return this._makeRequest({
        path: "/field/search",
        ...args,
      });
    },
    getCustomFieldContexts({
      fieldId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/field/${fieldId}/context`,
        ...args,
      });
    },
    countIssuesUsingJQL(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/search/approximate-count",
        ...args,
      });
    },
    checkIssuesAgainstJQL(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/jql/match",
        ...args,
      });
    },
    postSearchIssues(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/search/jql",
        ...args,
      });
    },
    getIssuePickerSuggestions(args = {}) {
      return this._makeRequest({
        path: "/issue/picker",
        ...args,
      });
    },
    listBoards(args = {}) {
      return this._makeAgileRequest({
        path: "/board",
        ...args,
      });
    },
    getBoard({
      boardId, ...args
    } = {}) {
      return this._makeAgileRequest({
        path: `/board/${boardId}`,
        ...args,
      });
    },
    listBoardIssues({
      boardId, ...args
    } = {}) {
      return this._makeAgileRequest({
        path: `/board/${boardId}/issue`,
        ...args,
      });
    },
    listSprints({
      boardId, ...args
    } = {}) {
      return this._makeAgileRequest({
        path: `/board/${boardId}/sprint`,
        ...args,
      });
    },
    getSprint({
      sprintId, ...args
    } = {}) {
      return this._makeAgileRequest({
        path: `/sprint/${sprintId}`,
        ...args,
      });
    },
    listSprintIssues({
      sprintId, ...args
    } = {}) {
      return this._makeAgileRequest({
        path: `/sprint/${sprintId}/issue`,
        ...args,
      });
    },
    moveIssuesToSprint({
      sprintId, ...args
    } = {}) {
      return this._makeAgileRequest({
        method: "POST",
        path: `/sprint/${sprintId}/issue`,
        ...args,
      });
    },
    createSprint(args = {}) {
      return this._makeAgileRequest({
        method: "POST",
        path: "/sprint",
        ...args,
      });
    },
    listEpics({
      boardId, ...args
    } = {}) {
      return this._makeAgileRequest({
        path: `/board/${boardId}/epic`,
        ...args,
      });
    },
    listEpicIssues({
      boardId, epicId, ...args
    } = {}) {
      return this._makeAgileRequest({
        path: `/board/${boardId}/epic/${epicId}/issue`,
        ...args,
      });
    },
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
