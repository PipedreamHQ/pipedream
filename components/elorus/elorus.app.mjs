import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "elorus",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "The name of the task",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Short description of the task",
      optional: true,
    },
    hourlyRate: {
      type: "string",
      label: "Hourly Rate",
      description: "The hourly rate of the task",
      optional: true,
    },
    project: {
      type: "string",
      label: "Project",
      description: "The project associated with the task",
      async options() {
        const response = await this.getProjects();
        const projectsIds = response.results;
        return projectsIds.map(({
          id,
          name,
        }) => ({
          value: id,
          label: name,
        }));
      },
      optional: true,
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "Specifies if the task is active",
      optional: true,
    },
    taskId: {
      type: "string",
      label: "Task Id",
      description: "The unique identifier of the task",
      async options({ page }) {
        try {
          const response = await this.getTasks({
            params: {
              "page": page + 1,
              "page_size": 100,
            },
          });
          const tasks = response.results || [];
          if (!tasks.length) {
            return [];
          }
          return tasks.map(({
            id, name,
          }) => ({
            value: id,
            label: name,
          }));
        } catch (err) {
          if (err.response?.data?.detail === "Invalid page.") {
            return [];
          }
          throw err;
        }
      },
    },
    search: {
      type: "string",
      label: "Search",
      description: "A search term",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.elorus.com";
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
          "Authorization": `Token ${this.$auth.api_key}`,
          "X-Elorus-Organization": `${this.$auth.organization_id}`,
          ...headers,
        },
      });
    },
    async getTasks(args = {}) {
      return this._makeRequest({
        path: "/v1.2/tasks/",
        ...args,
      });
    },
    async getProjects(args = {}) {
      return this._makeRequest({
        path: "/v1.2/projects/",
        ...args,
      });
    },
    async deleteTasks({
      taskId, ...args
    }) {
      return this._makeRequest({
        path: `/v1.2/tasks/${taskId}/`,
        method: "delete",
        ...args,
      });
    },
    async createTask(args = {}) {
      return this._makeRequest({
        path: "/v1.2/tasks/",
        method: "post",
        ...args,
      });
    },
  },
};
