import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "microsoft_365_planner",
  propDefinitions: {
    groupId: {
      type: "string",
      label: "Group",
      description: "The group container of the plan",
      async options({ prevContext }) {
        const args = prevContext?.nextLink
          ? {
            url: prevContext.nextLink,
          }
          : {};
        const response = await this.listGroups(args);
        const options = response.value?.map(({
          id: value, displayName: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            nextLink: response["@odata.nextLink"],
          },
        };
      },
    },
    planId: {
      type: "string",
      label: "Plan",
      description: "Identifier of a plan",
      async options({
        groupId, prevContext,
      }) {
        if (!groupId) {
          return [];
        }
        const args = {
          groupId,
        };
        if (prevContext?.nextLink) {
          args.url = prevContext.nextLink;
        }
        const response = await this.listPlans(args);
        const options = response.value?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            nextLink: response["@odata.nextLink"],
          },
        };
      },
    },
    bucketId: {
      type: "string",
      label: "Bucket",
      description: "Identifier of a bucket",
      optional: true,
      async options({
        planId, prevContext,
      }) {
        if (!planId) {
          return [];
        }
        const args = {
          planId,
        };
        if (prevContext?.nextLink) {
          args.url = prevContext.nextLink;
        }
        const response = await this.listBuckets(args);
        const options = response.value?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            nextLink: response["@odata.nextLink"],
          },
        };
      },
    },
    assigneeIds: {
      type: "string[]",
      label: "Assignees",
      description: "Array of assignee Ids",
      optional: true,
      async options({
        groupId, prevContext,
      }) {
        if (!groupId) {
          return [];
        }
        const args = {
          groupId,
        };
        if (prevContext?.nextLink) {
          args.url = prevContext.nextLink;
        }
        const response = await this.listMembers(args);
        const options = response.value?.map(({
          id: value, mail: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            nextLink: response["@odata.nextLink"],
          },
        };
      },
    },
    taskId: {
      type: "string",
      label: "Task",
      description: "Identifier of a task",
      optional: true,
      async options({
        planId, prevContext,
      }) {
        if (!planId) {
          return [];
        }
        const args = {
          planId,
        };
        if (prevContext?.nextLink) {
          args.url = prevContext.nextLink;
        }
        const response = await this.listTasks(args);
        const options = response.value?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            nextLink: response["@odata.nextLink"],
          },
        };
      },
    },
    userTaskId: {
      type: "string",
      label: "User Task ID",
      description: "Identifier of a user task",
      async options() {
        const response = await this.listUserTasks();
        return response.value?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    conversationThreadId: {
      type: "string",
      label: "Conversation Thread ID",
      description: "Identifier of the conversation thread associated with the task.",
      optional: true,
      async options({ groupId }) {
        if (!groupId) {
          return [];
        }
        const response = await this.listThreads({
          groupId,
        });
        return response.value?.map(({
          id: value, topic: label,
        }) => ({
          value,
          label,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://graph.microsoft.com/v1.0";
    },
    _headers(headers) {
      return {
        ...headers,
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, url, headers, ...args
    }) {
      return axios($, {
        url: url || `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...args,
      });
    },
    listGroups(args = {}) {
      return this._makeRequest({
        path: "/groups",
        ...args,
      });
    },
    listPlans({
      groupId, ...args
    }) {
      return this._makeRequest({
        path: `/groups/${groupId}/planner/plans`,
        ...args,
      });
    },
    listMembers({
      groupId, ...args
    }) {
      return this._makeRequest({
        path: `/groups/${groupId}/members`,
        ...args,
      });
    },
    listBuckets({
      planId, ...args
    }) {
      return this._makeRequest({
        path: `/planner/plans/${planId}/buckets`,
        ...args,
      });
    },
    listTasks({
      planId, ...args
    }) {
      return this._makeRequest({
        path: `/planner/plans/${planId}/tasks`,
        ...args,
      });
    },
    createPlan(args = {}) {
      return this._makeRequest({
        path: "/planner/plans",
        method: "POST",
        ...args,
      });
    },
    createTask(args = {}) {
      return this._makeRequest({
        path: "/planner/tasks",
        method: "POST",
        ...args,
      });
    },
    createBucket(args = {}) {
      return this._makeRequest({
        path: "/planner/buckets",
        method: "POST",
        ...args,
      });
    },
    getTask({
      taskId, ...args
    }) {
      return this._makeRequest({
        path: `/planner/tasks/${taskId}`,
        ...args,
      });
    },
    listUserTasks(args = {}) {
      return this._makeRequest({
        path: "/me/planner/tasks",
        ...args,
      });
    },
    listThreads({
      groupId, ...args
    }) {
      return this._makeRequest({
        path: `/groups/${groupId}/threads`,
        ...args,
      });
    },
    async *paginate({
      fn, args,
    }) {
      let nextLink;
      do {
        if (nextLink) {
          args = {
            ...args,
            url: nextLink,
          };
        }
        const response = await fn(args);

        for (const value of response.value) {
          yield value;
        }

        nextLink = response["@odata.nextLink"];
      } while (nextLink);
    },
  },
};
