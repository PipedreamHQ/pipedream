import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "teamcamp",
  propDefinitions: {
    projectName: {
      type: "string",
      label: "Project Name",
      description: "The Name of the project",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the project, We expect yyyy-MM-dd",
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date of the project, We expect yyyy-MM-dd",
    },
    taskName: {
      type: "string",
      label: "Task Name",
      description: "The Name of the task",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the task",
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority level of the task",
      optional: true,
      options: [
        "No Priority",
        "Urgent",
        "High",
        "Medium",
        "Low",
      ],
    },
    estimateTime: {
      type: "string",
      label: "Estimate Time",
      description: "Estimated time required for the task (hh)",
      optional: true,
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
      async options() {
        const projectsIds = await this.listProjects();

        return projectsIds.map(({
          projectId, projectName,
        }) => ({
          value: projectId,
          label: projectName,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.teamcamp.app/v1.0";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "apiKey": `${this.$auth.api_key}`,
        },
      });
    },
    async createProject(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/project",
        ...args,
      });
    },
    async createTask(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/task",
        ...args,
      });
    },
    async listProjects(args = {}) {
      return this._makeRequest({
        path: "/project",
        ...args,
      });
    },
  },
};
