import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";

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
    client() {
      return Client.init({
        authProvider: (done) => {
          done(null, this.$auth.oauth_access_token);
        },
      });
    },
    listGroups({ params = {} } = {}) {
      return this.client().api("/groups")
        .get(params);
    },
    listPlans({
      groupId, params = {},
    }) {
      return this.client().api(`/groups/${groupId}/planner/plans`)
        .get(params);
    },
    listMembers({
      groupId, params = {},
    }) {
      return this.client().api(`/groups/${groupId}/members`)
        .get(params);
    },
    listBuckets({
      planId, params = {},
    }) {
      return this.client().api(`/planner/plans/${planId}/buckets`)
        .get(params);
    },
    listTasks({
      planId, params = {},
    }) {
      return this.client().api(`/planner/plans/${planId}/tasks`)
        .get(params);
    },
    createPlan({ data = {} } = {}) {
      return this.client().api("/planner/plans")
        .post(data);
    },
    createTask({ data = {} } = {}) {
      return this.client().api("/planner/tasks")
        .post(data);
    },
    createBucket({ data = {} } = {}) {
      return this.client().api("/planner/buckets")
        .post(data);
    },
    getTask({
      taskId, params = {},
    }) {
      return this.client().api(`/planner/tasks/${taskId}`)
        .get(params);
    },
    listUserTasks({ params = {} } = {}) {
      return this.client().api("/me/planner/tasks")
        .get(params);
    },
    listThreads({
      groupId, params = {},
    }) {
      return this.client().api(`/groups/${groupId}/threads`)
        .get(params);
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
