import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "jira",
  propDefinitions: {
    projectID: {
      type: "string",
      label: "Project ID",
      description: "The project ID.",
      async options({ prevContext }) {
        const { startAt } = prevContext || {};
        const pageSize = 50;
        const resp = await this.getAllProjects({
          params: {
            startAt,
            maxResults: pageSize,
          },
        });
        return {
          options: resp?.values.map((e) => ({
            label: e.name,
            value: e.id,
          })),
          context: {
            after: startAt,
          },
        };
      },
    },
    issueType: {
      type: "string",
      label: "Issue Type",
      description: "An ID identifying the type of issue, [Check the API docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/#api-rest-api-3-issue-post) to see available options",
      async options({ projectID }) {
        const resp = await this.getIssueTypes({
          projectID,
        });
        // Because we select a project, we get issue types for only that and only one project
        return resp.projects[0].issuetypes.map((issuetype) => ({
          label: issuetype.name,
          value: issuetype.id,
        }));
      },
    },
    labels: {
      type: "string",
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
      label: "Issue id or key",
      description: "The ID or key of the issue where the attachment will be added to.",
      async options({ prevContext }) {
        const { startAt } = prevContext || {};
        const pageSize = 50;
        const resp = await this.getIssues({
          params: {
            startAt,
            maxResults: pageSize,
          },
        });
        return {
          options: resp?.issues?.map((issue) => ({
            value: issue.id,
            label: issue.key,
          })),
          context: {
            after: startAt,
          },
        };
      },
    },
    accountId: {
      type: "string",
      label: "Assignee Id",
      description: "The account ID of the user, which uniquely identifies the user across all Atlassian products, For example, `5b10ac8d82e05b22cc7d4ef5`, ",
      async options({ prevContext }) {
        const { startAt } = prevContext || {};
        const pageSize = 50;
        const resp = await this.getUsers({
          params: {
            startAt,
            maxResults: pageSize,
          },
        });
        return {
          options: resp?.map((user) => ({
            value: user.accountId,
            label: user.displayName,
          })),
          context: {
            after: startAt,
          },
        };
      },
    },
    properties: {
      type: "any",
      label: "Properties",
      description: "A list of properties.",
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
      description: "Extra properties of any type may be provided to this object.",
      optional: true,
    },
    transition: {
      type: "object",
      label: "Transition",
      description: "Details of a transition. Required when performing a transition, optional when creating or editing an issue, See `Transition` section of [doc](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-put)",
      optional: true,
    },
    fields: {
      type: "object",
      label: "Fields",
      description: "List of issue screen fields to update, specifying the sub-field to update and its value for each field. This field provides a straightforward option when setting a sub-field. When multiple sub-fields or other operations are required, use `update`. Fields included in here cannot be included in `update`.",
      optional: true,
    },
  },

  methods: {
    parseObject(obj) {
      for (let o in obj) {
        try {
          obj[o] = JSON.parse(obj[o]);
        } catch (err) {
          // do nothing, if cannot parsed as json, it must remain the same.
        }
      }
      return obj;
    },
    async _getCloudId($) {
      // First we must make a request to get our the cloud instance ID tied
      // to our connected account, which allows us to construct the correct REST API URL.
      // See Section 3.2 of
      // https://developer.atlassian.com/cloud/jira/platform/oauth-2-authorization-code-grants-3lo-for-apps/
      const resp = await axios($ ?? this, {
        url: "https://api.atlassian.com/oauth/token/accessible-resources",
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
      // Assumes the access token has access to a single instance
      return resp[0].id;
    },
    _getHeaders(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "user-agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    async _getUrl($, path) {
      const cloudId = await this._getCloudId($);
      return `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3${path}`;
    },
    async _makeRequest({
      $,
      path,
      headers,
      ...otherConfig
    } = {}) {
      const config = {
        url: await this._getUrl($, path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      };
      return axios($ ?? this, config);
    },
    async createHook(opts) {
      const {
        url,
        events,
        jqlFilter,
        //fieldIdsFilter,
      } = opts;
      const requestBody = {
        url,
      };
      const webhookObj = {
        events,
        jqlFilter,
      };
      requestBody.webhooks = [
        webhookObj,
      ];
      const response = await this._makeRequest({
        method: "POST",
        path: "/webhook",
        data: requestBody,
      });
      if (response?.webhookRegistrationResult[0]?.errors) {
        throw new Error(`Could not create trigger(s). ${response.webhookRegistrationResult[0].errors}`);
      }
      return {
        hookId: response?.webhookRegistrationResult[0]?.createdWebhookId,
      };
    },
    async deleteHook(opts) {
      const { hookId } = opts;
      const requestBody = {
        webhookIds: [
          hookId,
        ],
      };
      return await this._makeRequest({
        method: "DELETE",
        path: "/webhook",
        data: requestBody,
      });
    },
    async assignIssue({
      issueIdOrKey,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "PUT",
        path: `/issue/${issueIdOrKey}/assignee`,
        ...args,
      });
    },
    async addWatcher({
      issueIdOrKey,
      accountId,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "POST",
        path: `/issue/${issueIdOrKey}/watchers`,
        data: `"${accountId}"`,
        ...args,
      });
    },
    async addAttachmentToIssue({
      issueIdOrKey,
      ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/issue/${issueIdOrKey}/attachments`,
        ...args,
      });
    },
    async addCommentToIssue({
      issueIdOrKey,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "POST",
        path: `/issue/${issueIdOrKey}/comment`,
        ...args,
      });
    },
    async createIssue({ ...args } = {}) {
      return await this._makeRequest({
        method: "POST",
        path: "/issue",
        ...args,
      });
    },
    async createVersion({ ...args } = {}) {
      return await this._makeRequest({
        method: "POST",
        path: "/version",
        ...args,
      });
    },
    async deleteProject({
      projectIdOrKey,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "DELETE",
        path: `/project/${projectIdOrKey}`,
        ...args,
      });
    },
    async getAllProjects({ ...args } = {}) {
      return await this._makeRequest({
        method: "GET",
        path: "/project/search",
        ...args,
      });
    },
    async getLabels({ ...args } = {}) {
      return await this._makeRequest({
        method: "GET",
        path: "/label",
        ...args,
      });
    },
    async getUsers({ ...args } = {}) {
      return await this._makeRequest({
        method: "GET",
        path: "/users/search",
        ...args,
      });
    },
    async getIssue({
      issueIdOrKey,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "GET",
        path: `/issue/${issueIdOrKey}`,
        ...args,
      });
    },
    async getIssues({ ...args } = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/search",
        ...args,
      });
    },
    async getTask({
      taskId,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "GET",
        path: `/task/${taskId}`,
        ...args,
      });
    },
    async getTransitions({
      issueIdOrKey,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "GET",
        path: `/issue/${issueIdOrKey}/transitions`,
        ...args,
      });
    },
    async getUser({ ...args } = {}) {
      return await this._makeRequest({
        method: "GET",
        path: "/user",
        ...args,
      });
    },
    async listIssueComments({
      issueIdOrKey,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "GET",
        path: `/issue/${issueIdOrKey}/comment`,
        ...args,
      });
    },
    async transitionIssue({
      issueIdOrKey,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "POST",
        path: `/issue/${issueIdOrKey}/transitions`,
        ...args,
      });
    },
    async updateComment({
      issueIdOrKey,
      commentId,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "PUT",
        path: `/issue/${issueIdOrKey}/comment/${commentId}`,
        ...args,
      });
    },
    async updateIssue({
      issueIdOrKey,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "PUT",
        path: `/issue/${issueIdOrKey}`,
        ...args,
      });
    },
    async getIssueTypes({
      projectID,
      ...args
    } = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/issue/createmeta",
        params: {
          projectIds: projectID,
        },
        ...args,
      });
    },
    async getWebhook({ ...args } = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/webhook",
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
