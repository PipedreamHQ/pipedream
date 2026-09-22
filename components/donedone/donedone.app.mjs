import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "donedone",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The ID of an account",
      async options() {
        const { listAccounts } = await this.listAccounts();
        return listAccounts?.map((account) => ({
          label: account.name,
          value: account.id,
        })) || [];
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of a project",
      async options({ accountId }) {
        if (!accountId) {
          return [];
        }
        const projects = await this.listProjects({
          accountId,
        });
        return projects?.map((project) => ({
          label: project.name,
          value: project.id,
        })) || [];
      },
    },
    assigneeId: {
      type: "string",
      label: "Assignee ID",
      description: "The ID of an assignee",
      async options({
        accountId, projectId,
      }) {
        if (!accountId || !projectId) {
          return [];
        }
        const { listAssignees } = await this.getTaskOptions({
          accountId,
          projectId,
        });
        return listAssignees?.map((assignee) => ({
          label: assignee.name,
          value: assignee.id,
        })) || [];
      },
    },
    statusId: {
      type: "string",
      label: "Status ID",
      description: "The ID of a task status",
      async options({
        accountId, projectId,
      }) {
        if (!accountId || !projectId) {
          return [];
        }
        const { listStatuses } = await this.getTaskOptions({
          accountId,
          projectId,
        });
        return listStatuses?.map((status) => ({
          label: status.name,
          value: status.id,
        })) || [];
      },
    },
    priorityId: {
      type: "string",
      label: "Priority ID",
      description: "The ID of a task priority",
      async options({
        accountId, projectId,
      }) {
        if (!accountId || !projectId) {
          return [];
        }
        const { listPriorities } = await this.getTaskOptions({
          accountId,
          projectId,
        });
        return listPriorities?.map((priority) => ({
          label: priority.name,
          value: priority.id,
        })) || [];
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "The tags of the task",
      optional: true,
      async options({
        accountId, projectId,
      }) {
        if (!accountId || !projectId) {
          return [];
        }
        const { listTags } = await this.getTaskOptions({
          accountId,
          projectId,
        });
        return listTags?.map((tag) => tag) || [];
      },
    },
    watcherIds: {
      type: "string[]",
      label: "Watcher IDs",
      description: "The IDs of the watchers of the task",
      optional: true,
      async options({
        accountId, projectId,
      }) {
        if (!accountId || !projectId) {
          return [];
        }
        const { listWatchers } = await this.getTaskOptions({
          accountId,
          projectId,
        });
        return listWatchers?.map((watcher) => ({
          label: watcher.name,
          value: watcher.id,
        })) || [];
      },
    },
    atMentionIds: {
      type: "string[]",
      label: "At Mention IDs",
      description: "The IDs of the users that are mentioned in the task",
      optional: true,
      async options({
        accountId, projectId,
      }) {
        if (!accountId || !projectId) {
          return [];
        }
        const { listAtMentionUsers } = await this.getTaskOptions({
          accountId,
          projectId,
        });
        return listAtMentionUsers?.map((atMention) => ({
          label: atMention.name,
          value: atMention.id,
        })) || [];
      },
    },
    linkableTaskIds: {
      type: "string[]",
      label: "Linkable Task IDs",
      description: "The IDs of the tasks that can be linked to the task",
      optional: true,
      async options({
        accountId, projectId,
      }) {
        if (!accountId || !projectId) {
          return [];
        }
        const tasks = await this.listLinkableTasks({
          accountId,
          projectId,
        });
        return tasks?.map((task) => ({
          label: task.title,
          value: task.id,
        })) || [];
      },
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "The ID of the originating conversation",
      optional: true,
      async options({
        accountId, page,
      }) {
        if (!accountId) {
          return [];
        }
        const { listConversations } = await this.listConversations({
          accountId,
          params: {
            page: page + 1,
          },
        });
        return listConversations?.map((conversation) => ({
          label: conversation.title,
          value: conversation.id,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://2.donedone.com/public-api";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: {
          username: `${this.$auth.email}`,
          password: `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    getTaskOptions({
      accountId, projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/${accountId}/internal-projects/${projectId}/tasks/filter-options`,
        ...opts,
      });
    },
    listAccounts(opts = {}) {
      return this._makeRequest({
        path: "/accounts",
        ...opts,
      });
    },
    listProjects({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `/${accountId}/internal-projects`,
        ...opts,
      });
    },
    listTasks({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `/${accountId}/tasks/search`,
        ...opts,
      });
    },
    listLinkableTasks({
      accountId, projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/${accountId}/internal-projects/${projectId}/tasks/linkable-tasks`,
        ...opts,
      });
    },
    listConversations({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `/${accountId}/conversations/search`,
        ...opts,
      });
    },
    createTask({
      accountId, projectId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/${accountId}/internal-projects/${projectId}/tasks`,
        ...opts,
      });
    },
    addPeopleToProject({
      accountId, projectId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/${accountId}/internal-projects/${projectId}/people`,
        ...opts,
      });
    },
    async *paginate({
      fn, accountId, params, resourceKey, paginationKey, max,
    }) {
      params = {
        ...params,
        page: 1,
      };
      let hasMore, count = 0;
      do {
        const response = await fn({
          accountId,
          params,
        });
        const items = response[resourceKey];
        if (!items?.length) {
          return;
        }
        for (const item of items) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        const totalItems = response[paginationKey];
        hasMore = count < totalItems;
        params.page++;
      } while (hasMore);
    },
  },
};
