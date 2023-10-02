import { axios } from "@pipedream/platform";
import {
  COLORS, TYPES,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "teamgantt",
  propDefinitions: {
    color: {
      type: "string",
      label: "Color",
      description: "The color code of the task.",
      options: COLORS,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "YYYY-MM-DD format.",
    },
    estimatedHours: {
      type: "integer",
      label: "Estimated Hours",
      description: "The number of hours this task should take to complete.",
    },
    isStarred: {
      type: "boolean",
      label: "Is Starred",
      description: "Whether the task is flagged as starred or not.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The task name.",
    },
    percentComplete: {
      type: "integer",
      label: "Percent Complete",
      description: "Update the progress of the task. (100 = completed).",
    },
    projectId: {
      type: "string",
      label: "Project Id",
      description: "The project to create the task in.",
      async options() {
        const { projects } = await this.listProjects();

        return projects.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    parentGroupId: {
      type: "string",
      label: "Parent Group Id",
      description: "The parent group to nest the task in - defaults to the last group in the project.",
      async options({
        taskId, projectId,
      }) {
        if (taskId) {
          const { project_id } = await this.getTask(taskId);
          projectId = project_id;
        }

        const groups = await this.listGroups({
          params: {
            project_ids: [
              projectId,
            ],
          },
        });

        return groups.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "The order of the task - defaults to end of the parent group.",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "YYYY-MM-DD format.",
    },
    taskId: {
      type: "string",
      label: "Task Id",
      description: "The id of the task to update.",
      async options() {
        const tasks = await this.listTasks();

        return tasks.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the task to create.",
      options: TYPES,
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.teamgantt.com/v1";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    createTask(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "tasks",
        ...args,
      });
    },
    getTask(taskId) {
      return this._makeRequest({
        path: `tasks/${taskId}`,
      });
    },
    listComments({
      type, projectId, groupId, taskId,
    }) {
      return this._makeRequest({
        path: `${type}/${groupId || projectId || taskId}/comments`,
      });
    },
    listGroups(args = {}) {
      return this._makeRequest({
        path: "groups",
        ...args,
      });
    },
    listProjects(args = {}) {
      return this._makeRequest({
        path: "projects/all",
        ...args,
      });
    },
    listTasks(args = {}) {
      return this._makeRequest({
        path: "tasks",
        ...args,
      });
    },
    updateTask({
      taskId, ...args
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `tasks/${taskId}`,
        ...args,
      });
    },
  },
};
