import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "breeze",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The project to associate the task with",
      async options() {
        const projects = await this.getProjects();
        return projects.map((project) => ({
          label: project.name || project.id,
          value: project.id,
        }));
      },
    },
    stageId: {
      type: "string",
      label: "Stage ID",
      description: "The stage (list) to associate the task with",
      async options({ projectId }) {
        if (!projectId) return [];
        const lists = await this.getLists({
          projectId,
        });
        return lists.map((list) => ({
          label: list.name || list.id,
          value: list.id,
        }));
      },
    },
    swimlaneId: {
      type: "string",
      label: "Swimlane ID",
      description: "The swimlane to associate the task with",
      async options({ projectId }) {
        if (!projectId) return [];
        const swimlanes = await this.getSwimlanes({
          projectId,
        });
        return swimlanes.map((swimlane) => ({
          label: swimlane.name || swimlane.id,
          value: swimlane.id,
        }));
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The task to monitor",
      async options({ projectId }) {
        if (!projectId) return [];
        const tasks = await this.getTasks({
          projectId,
        });
        return tasks.map((task) => ({
          label: task.name || task.id,
          value: task.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.breeze.pm";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        params: {
          api_token: this.$auth.api_token,
          ...otherOpts.params,
        },
      });
    },
    async getWorkspaces(args = {}) {
      return this._makeRequest({
        path: "/workspaces.json",
        ...args,
      });
    },
    async getProjects(args = {}) {
      return this._makeRequest({
        path: "/projects.json",
        ...args,
      });
    },
    async getLists({
      projectId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/stages.json`,
        ...args,
      });
    },
    async getSwimlanes({
      projectId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/swimlanes.json`,
        ...args,
      });
    },
    async getTasks({
      projectId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/V2/projects/${projectId}/cards.json`,
        ...args,
      });
    },
    async createTask({
      projectId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/cards.json`,
        method: "post",
        ...args,
      });
    },
    async createProject(args = {}) {
      return this._makeRequest({
        path: "/projects.json",
        method: "post",
        ...args,
      });
    },
  },
};
