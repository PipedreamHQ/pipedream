import {
  ConfigurationError, axios,
} from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "jira",
  propDefinitions: {
    cloudId: {
      type: "string",
      label: "Cloud ID",
      description: "The cloud ID.",
      useQuery: true,
      async options() {
        const clouds = await this.getClouds();

        return clouds.map((cloud) => ({
          label: cloud.name,
          value: cloud.id,
        }));
      },
    },
    projectID: {
      type: "string",
      label: "Project ID",
      description: "The project ID.",
      useQuery: true,
      async options({
        prevContext, query, cloudId,
      }) {
        let { startAt } = prevContext || {};
        const pageSize = 50;
        const resp = await this.getAllProjects({
          cloudId,
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
      description: "An ID identifying the type of issue, [Check the API docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/#api-rest-api-3-issue-post) to see available options",
      async options({
        cloudId, projectId,
      }) {
        const issueTypes = await this.getProjectIssueTypes({
          cloudId,
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
      description: "The ID or key of the issue where the attachment will be added",
      async options({
        prevContext, cloudId, tasksOnly = false,
      }) {
        let { startAt } = prevContext || {};
        const pageSize = 50;
        const jql = tasksOnly
          ? "project is not EMPTY AND issuetype = \"Task\" ORDER BY created DESC"
          : "project is not EMPTY ORDER BY created DESC";
        const resp = await this.searchIssues({
          cloudId,
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
        prevContext, query, cloudId,
      }) {
        let { startAt } = prevContext || {};
        const pageSize = 50;
        const resp = await this.findUsers({
          cloudId,
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
        prevContext, issueIdOrKey, cloudId,
      }) {
        if (!issueIdOrKey) {
          return [];
        }
        let { startAt } = prevContext || {};
        const pageSize = 50;
        try {
          const resp = await this.getTransitions({
            cloudId,
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
        cloudId,
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
          cloudId,
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
        cloudId,
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
          cloudId,
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
    commentId: {
      type: "string",
      label: "Comment ID",
      description: "The ID of the comment",
      async options({
        prevContext, issueIdOrKey, cloudId,
      }) {
        if (!issueIdOrKey) {
          return [];
        }
        let { startAt } = prevContext || {};
        const pageSize = 50;
        try {
          const resp = await this.listIssueComments({
            issueIdOrKey,
            cloudId,
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
    _makeRequest({
      $ = this, url, path, headers, cloudId, ...args
    } = {}) {
      const config = {
        url: url || `${this._getUrl(cloudId)}${path}`,
        headers: this._getHeaders(headers),
        ...args,
      };
      return axios($, config);
    },
    async createHook({
      cloudId, url, events, jqlFilter,
    } = {}) {
      const response = await this._makeRequest({
        cloudId,
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
      cloudId, hookId,
    } = {}) {
      return this._makeRequest({
        cloudId,
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
      cloudId, issueIdOrKey, ...args
    } = {}) {
      return this._makeRequest({
        cloudId,
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
      cloudId, issueIdOrKey, transition, ...args
    } = {}) {
      if (transition) {
        await this.transitionIssue({
          cloudId,
          issueIdOrKey,
          data: {
            transition,
          },
        });
      }
      return this._makeRequest({
        cloudId,
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
    async *getResourcesStream({
      cloudId,
      resourceFn,
      resourceFnArgs,
      resourceFiltererFn,
    }) {
      let page = 0;
      const pageSize = 50;
      while (true) {
        const nextResources = await resourceFn({
          cloudId,
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
