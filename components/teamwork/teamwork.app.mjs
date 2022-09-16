import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "teamwork",
  propDefinitions: {
    tasklistId: {
      type: "string",
      label: "Tasklist Id",
      description: "Id of the tasklist to list tasks from",
      async options({
        projectId,
        page,
      }) {
        const tasklists = await this.listTasklistsFromProject(projectId, page + 1);
        return tasklists.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
    peopleId: {
      type: "string",
      label: "People Id",
      description: "Id of the people to list tasks from",
      async options({ page }) {
        const people = await this.listPeople(page + 1);
        return people.map((item) => ({
          label: `${item["first-name"]} ${item["last-name"]}`,
          value: item.id,
        }));
      },
    },
    projectId: {
      type: "string",
      label: "Project Id",
      description: "Id of the project to list tasks from",
      async options() {
        const projects = await this.listProjects();
        return projects.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
    columnId: {
      type: "string",
      label: "Column Id",
      description: "Id of the column to list tasks from",
      async options({
        projectId,
        page,
      }) {
        const columns = await this.listColumns(projectId, page + 1);
        return columns.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
    taskId: {
      type: "string",
      label: "Task Id",
      description: "Id of the task to list tasks from",
      async options({
        projectId,
        page,
      }) {
        const params = {
          page: page + 1,
        };
        const tasks = await this.listProjectTasks(projectId, params);
        return tasks.map((item) => ({
          label: item.content,
          value: item.id,
        }));
      },
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the task",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the task",
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority of the task",
      optional: true,
      options: [
        "Low",
        "Medium",
        "High",
      ],
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The date the task should start. `yyyymmdd`",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The date the task is due `yyyymmdd`",
      optional: true,
    },
    useDefaults: {
      type: "boolean",
      label: "Use Defaults",
      description: "Use the default values for the task",
      optional: true,
    },
  },
  methods: {
    _getBaseUrl() {
      return this.$auth.domain;
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _getAxiosParams(opts = {}) {
      const res = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return res;
    },
    async listProjects(ctx = this) {
      const res = await axios(ctx, this._getAxiosParams({
        method: "GET",
        path: "projects.json",
      }));
      return res?.projects || [];
    },
    async listTasklistsFromProject(projectId, page, ctx = this) {
      const res = await axios(ctx, this._getAxiosParams({
        method: "GET",
        path: `projects/${projectId}/tasklists.json`,
        params: {
          page,
        },
      }));
      return res?.tasklists || [];
    },
    async listPeople(page, ctx = this) {
      const res = await axios(ctx, this._getAxiosParams({
        method: "GET",
        path: "people.json",
        params: {
          page,
        },
      }));
      return res?.people || [];
    },
    async listColumns(projectId, page, ctx = this) {
      const res = await axios(ctx, this._getAxiosParams({
        method: "GET",
        path: `projects/${projectId}/boards/columns.json`,
        params: {
          page,
        },
      }));
      return res?.columns || [];
    },
    async createTask(taskListId, data, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "POST",
        path: `tasklists/${taskListId}/tasks.json`,
        data: {
          "todo-item": data,
        },
      }));
    },
    async updateTask(taskId, data, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "PUT",
        path: `tasks/${taskId}.json`,
        data: {
          "todo-item": data,
        },
      }));
    },
    async deleteTask(taskId, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "DELETE",
        path: `tasks/${taskId}.json`,
      }));
    },
    async listProjectTasks(projectId, params, ctx = this) {
      const res = await axios(ctx, this._getAxiosParams({
        method: "GET",
        path: `projects/${projectId}/tasks.json`,
        params,
      }));
      return res["todo-items"] || [];
    },
  },
};
