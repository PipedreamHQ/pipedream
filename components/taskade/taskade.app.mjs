import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "taskade",
  propDefinitions: {
    task_id: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task to track due date for",
      required: true,
    },
    assignee_id: {
      type: "string",
      label: "Assignee ID",
      description: "The ID of the assignee to filter by",
      optional: true,
    },
    task_title: {
      type: "string",
      label: "Task Title",
      description: "The title of the task to be created",
      required: true,
    },
    workspace: {
      type: "string",
      label: "Workspace",
      description: "The workspace where the task should be created",
      required: true,
    },
    due_date: {
      type: "string",
      label: "Due Date",
      description: "The due date for the task",
      optional: true,
    },
    assignees: {
      type: "string[]",
      label: "Assignees",
      description: "The assignees for the task",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.taskade.com/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createTask(task_title, workspace, due_date, assignees) {
      const project = await this._makeRequest({
        method: "POST",
        path: `/projects/${workspace}/tasks/`,
        data: {
          tasks: [
            {
              content: task_title,
            },
          ],
        },
      });

      if (due_date) {
        await this._makeRequest({
          method: "PUT",
          path: `/projects/${workspace}/tasks/${project.item[0].id}/date`,
          data: {
            start: {
              date: due_date,
            },
          },
        });
      }

      if (assignees) {
        await this._makeRequest({
          method: "PUT",
          path: `/projects/${workspace}/tasks/${project.item[0].id}/assignees`,
          data: {
            handles: assignees,
          },
        });
      }

      return project;
    },
    async getTask(task_id) {
      return await this._makeRequest({
        path: `/tasks/${task_id}`,
      });
    },
  },
};
