import { axios } from "@pipedream/platform";

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
        const clouds = await this.getClouds()

        return clouds.map(cloud => ({
          label: cloud.name,
          value: cloud.id,
        }))
      },
    },
    projectID: {
      type: "string",
      label: "Project ID",
      description: "The project ID.",
      useQuery: true,
      async options({
        prevContext, query, cloudId
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
      async options({ projectID, cloudId }) {
        const resp = await this.getIssueTypes({
          cloudId,
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
      label: "Issue id or key",
      description: "The ID or key of the issue where the attachment will be added to.",
      async options({ prevContext, cloudId }) {
        let { startAt } = prevContext || {};
        const pageSize = 50;
        const resp = await this.getIssues({
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
      label: "Assignee Id",
      description: "The account ID of the user, which uniquely identifies the user across all Atlassian products, For example, `5b10ac8d82e05b22cc7d4ef5`",
      useQuery: true,
      async options({
        prevContext, query, cloudId
      }) {
        let { startAt } = prevContext || {};
        const pageSize = 50;
        const resp = await this.getUsers({
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
      type: "string",
      label: "Transition",
      description: "Details of a transition. Required when performing a transition, optional when creating or editing an issue, See `Transition` section of [doc](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-put). Also you can go edit the workflow and choose the Text option instead of the Diagram option. You can see the transition ID in parenthesis.",
      optional: true,
      async options({
        prevContext, issueIdOrKey, cloudId,
      }) {
        let { startAt } = prevContext || {};
        const pageSize = 50;
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
      },
    },
    fields: {
      type: "object",
      label: "Fields",
      description: "List of issue screen fields to update, specifying the sub-field to update and its value for each field. This field provides a straightforward option when setting a sub-field. When multiple sub-fields or other operations are required, use `update`. Fields included in here cannot be included in `update`. (.i.e for Fields \"fields\": {\"summary\":\"Completed orders still displaying in pending\",\"customfield_10010\":1,}) [see doc](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-put)",
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
    _getUrl(cloudId) {
      return `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3`;
    },
    async _makeRequest({
      $,
      path,
      headers,
      cloudId,
      ...otherConfig
    } = {}) {
      const config = {
        url: `${this._getUrl(cloudId)}${path}`,
        headers: this._getHeaders(headers),
        ...otherConfig,
      };
      return axios($ ?? this, config);
    },
    async createHook({ cloudId, ...opts }) {
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
        cloudId,
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
    async deleteHook({cloudId, ...opts}) {
      const { hookId } = opts;
      const requestBody = {
        webhookIds: [
          hookId,
        ],
      };
      return await this._makeRequest({
        cloudId,
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
      cloudId,
      issueIdOrKey,
      ...args
    } = {}) {
      return this._makeRequest({
        cloudId,
        method: "POST",
        path: `/issue/${issueIdOrKey}/attachments`,
        ...args,
      });
    },
    async addCommentToIssue({
      cloudId,
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
      cloudId,
      issueIdOrKey,
      transition,
      ...args
    } = {}) {
      if (transition) {
        await this._makeRequest({
          cloudId,
          method: "POST",
          path: `/issue/${issueIdOrKey}/transitions`,
          data: {
            transition,
          },
        });
      }
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
    async getWebhook(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/webhook",
        ...args,
      });
    },
    async getClouds(args = {}) {
      return axios(this, {
        url: "https://api.atlassian.com/oauth/token/accessible-resources",
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...args
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
