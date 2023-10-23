import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "kite_suite",
  propDefinitions: {
    workspace: {
      type: "string",
      label: "Workspace",
      description: "Workspace Key, found in Workspace Settings.",
    },
    projectId: {
      type: "string",
      label: "Project",
      description: "Identifier of a project",
      async options({ workspace }) {
        if (!workspace) {
          return [];
        }
        const { data } = await this.listProjects({
          workspace,
        });
        return data?.map(({ project }) => ({
          value: project._id,
          label: project.projectName,
        })) || [];
      },
    },
    taskId: {
      type: "string",
      label: "Task",
      description: "Identifier of a task",
      async options({
        projectId, workspace,
      }) {
        if (!workspace || !projectId) {
          return [];
        }
        const { data } = await this.listTasks({
          projectId,
          workspace,
        });
        return data?.map(({
          _id: value, summary: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    userId: {
      type: "string",
      label: "Assignee",
      description: "Identifier of a user to assign to the task",
      optional: true,
      async options({ workspace }) {
        if (!workspace) {
          return [];
        }
        const workspaceId = await this.getWorkspaceId(workspace);
        const { data } = await this.listUsers({
          workspace,
          workspaceId,
        });
        return data?.map(({
          _id: value, fullName: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    sprintId: {
      type: "string",
      label: "Sprint",
      description: "Identifier of a sprint",
      optional: true,
      async options({
        projectId, workspace,
      }) {
        if (!workspace || !projectId) {
          return [];
        }
        const { data } = await this.listSprints({
          projectId,
          workspace,
        });
        return data?.map(({
          _id: value, sprintName: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    messageId: {
      type: "string",
      label: "Message",
      description: "Identifier of a message",
      optional: true,
      async options({
        projectId, workspace, page,
      }) {
        if (!workspace || !projectId) {
          return [];
        }
        const { data: { chats } } = await this.listMessages({
          projectId,
          workspace,
          params: {
            page: page + 1,
          },
        });
        return chats?.map(({
          _id: value, message: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    issueType: {
      type: "string",
      label: "Issue Type",
      description: "The item type",
      options: [
        "task",
        "bug",
        "story",
      ],
      optional: true,
      default: "task",
    },
    summary: {
      type: "string",
      label: "Summary",
      description: "Summary of the new task",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the new task",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.kitesuite.com/api/v1";
    },
    _headers(workspace) {
      return {
        "workspace": `${workspace}`,
        "api-token": `${this.$auth.api_token}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      workspace,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(workspace),
        ...args,
      });
    },
    async getWorkspaceId(workspace) {
      const { data } = await this.getWorkspace({
        workspace,
      });
      if (data?.key === workspace) {
        return data._id;
      }
      throw new Error("Workspace ID not found");
    },
    getWorkspace(args = {}) {
      return this._makeRequest({
        path: "/workspace/user",
        ...args,
      });
    },
    listProjects(args = {}) {
      return this._makeRequest({
        path: "/project/owner",
        ...args,
      });
    },
    listTasks({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `/task/project/${projectId}`,
        ...args,
      });
    },
    listUsers({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `/user/workspace/${workspaceId}`,
        ...args,
      });
    },
    listSprints({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `/sprint/project/${projectId}`,
        ...args,
      });
    },
    listMessages({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `/chat/${projectId}`,
        ...args,
      });
    },
    createTask(args = {}) {
      return this._makeRequest({
        path: "/task",
        method: "POST",
        ...args,
      });
    },
    updateTask({
      taskId, ...args
    }) {
      return this._makeRequest({
        path: `/task/${taskId}`,
        method: "PATCH",
        ...args,
      });
    },
    sendMessageToGroup(args = {}) {
      return this._makeRequest({
        path: "/chat/message",
        method: "POST",
        ...args,
      });
    },
    sendMessageToUser(args = {}) {
      return this._makeRequest({
        path: "/chat/message/user",
        method: "POST",
        ...args,
      });
    },
  },
};
