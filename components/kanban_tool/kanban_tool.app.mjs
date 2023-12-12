import { axios } from "@pipedream/platform";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "kanban_tool",
  propDefinitions: {
    boardId: {
      type: "integer",
      label: "Board ID",
      description: "Board ID",
      async options() {
        return utils.asyncPropHandler({
          resourceFn: this.getUser,
          resourceKey: "boards",
        });
      },
    },
    taskId: {
      type: "integer",
      label: "Task ID",
      description: "Task ID",
      async options({ boardId }) {
        return utils.asyncPropHandler({
          resourceFn: this.getBoard,
          params: {
            boardId,
          },
          resourceKey: "tasks",
        });
      },
    },
    subtaskId: {
      type: "integer",
      label: "Subtask ID",
      description: "Subtask ID",
      async options({ taskId }) {
        return utils.asyncPropHandler({
          resourceFn: this.getTask,
          params: {
            taskId,
          },
          resourceKey: "subtasks",
        });
      },
    },
    swimlaneId: {
      type: "integer",
      label: "Swimlane ID",
      description: "Swimlane ID",
      optional: true,
      async options({ boardId }) {
        return utils.asyncPropHandler({
          resourceFn: this.getBoard,
          params: {
            boardId,
          },
          resourceKey: "swimlanes",
        });
      },
    },
    stageId: {
      type: "integer",
      label: "Stage ID",
      description: "Stage ID",
      optional: true,
      async options({ boardId }) {
        return utils.asyncPropHandler({
          resourceFn: this.getBoard,
          params: {
            boardId,
          },
          resourceKey: "workflow_stages",
        });
      },
    },
    boardUserId: {
      type: "integer",
      label: "Assignee ID",
      description: "Assignee ID",
      optional: true,
      async options({ boardId }) {
        return utils.asyncPropHandler({
          resourceFn: this.getBoard,
          params: {
            boardId,
          },
          resourceKey: "collaborators",
        });
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the task",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the task",
      optional: true,
    },
    taskVersion: {
      type: "integer",
      label: "Version",
      description: "Version of the subtask.",
      optional: true,
    },
    position: {
      type: "string",
      label: "Position",
      description: "Subtask's position on the task's subtasks list. Counted from `1`",
      optional: true,
    },
    isCompleted: {
      type: "boolean",
      label: "Is Completed",
      description: "If set, subtask has been marked as completed.",
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "Task's priority",
      optional: true,
      options: [
        {
          label: "low",
          value: "-1",
        },
        {
          label: "normal",
          value: "0",
        },
        {
          label: "high",
          value: "1",
        },
      ],
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "List of tags associated with task, e.g. `bug` ,`chrome` ,`something-else`",
      optional: true,
    },
    timeEstimate: {
      type: "integer",
      label: "Time Estimate",
      description: "Task's time estimate, measured in number of seconds",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Date to which the task is due. Must be in ISO format e.g. `2023-06-30T12:00:00.000+01:00`",
      optional: true,
    },
    isArchived: {
      type: "boolean",
      label: "Is Archived",
      description: "Set to `true` to search through archived tasks.",
      optional: true,
    },
    searchQuery: {
      type: "string",
      label: "Search Query",
      description: "Query used to filter tasks. Please see [query filters](https://kanbantool.com/developer/api-v3#searching-tasks).",
      optional: true,
    },
  },
  methods: {
    _getUrl(path) {
      return `https://${this.$auth.domain}.kanbantool.com/api/v3${path}`;
    },
    _getHeaders(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.api_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    async _makeRequest({
      $, path, headers, ...otherConfig
    } = {}) {
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      };
      return axios($ ?? this, config);
    },
    async getUser(args = {}) {
      return this._makeRequest({
        path: "/users/current.json",
        ...args,
      });
    },
    async getBoard({
      boardId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: `/boards/${boardId}.json`,
        ...args,
      });
    },
    async getTask({
      taskId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: `/tasks/${taskId}.json`,
        ...args,
      });
    },
    async getActivities({
      boardId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: `/boards/${boardId}/changelog.json`,
        ...args,
      });
    },
    async createTask(args = {}) {
      return this._makeRequest({
        path: "/tasks.json",
        method: "POST",
        ...args,
      });
    },
    async createSubtask(args = {}) {
      return this._makeRequest({
        path: "/subtasks.json",
        method: "POST",
        ...args,
      });
    },
    async createComment({
      taskId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: `/tasks/${taskId}/comments.json`,
        method: "POST",
        ...args,
      });
    },
    async updateTask({
      taskId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: `/tasks/${taskId}.json`,
        method: "PATCH",
        ...args,
      });
    },
    async updateSubtask({
      subtaskId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: `/subtasks/${subtaskId}.json`,
        method: "PATCH",
        ...args,
      });
    },
    async deleteSubtask({
      subtaskId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: `/subtasks/${subtaskId}.json`,
        method: "DELETE",
        ...args,
      });
    },
    async searchTasks(args = {}) {
      return this._makeRequest({
        path: "/tasks/search.json",
        ...args,
      });
    },
  },
};
