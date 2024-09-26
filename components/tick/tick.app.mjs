import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tick",
  propDefinitions: {
    clientId: {
      label: "Client ID",
      description: "The ID of the client",
      type: "string",
      async options({ page }) {
        const clients = await this.getClients({
          params: {
            page,
          },
        });

        return clients.map((client) => ({
          label: client.name,
          value: client.id,
        }));
      },
    },
    userId: {
      label: "User ID",
      description: "The ID of the user",
      type: "string",
      async options({ page }) {
        const users = await this.getUsers({
          params: {
            page,
          },
        });

        return users.map((user) => ({
          label: `${user.first_name} ${user.last_name}`,
          value: user.id,
        }));
      },
    },
    projectId: {
      label: "Project ID",
      description: "The ID of the project",
      type: "string",
      async options({ page }) {
        const projects = await this.getProjects({
          params: {
            page,
          },
        });

        return projects.map((project) => ({
          label: project.name,
          value: project.id,
        }));
      },
    },
    taskId: {
      label: "Task ID",
      description: "The ID of the task",
      type: "string",
      async options({ page }) {
        const tasks = await this.getTasks({
          params: {
            page,
          },
        });

        return tasks.map((task) => ({
          label: task.name,
          value: task.id,
        }));
      },
    },
  },
  methods: {
    _subscriptionId() {
      return this.$auth.subscription_id;
    },
    _apiToken() {
      return this.$auth.api_token;
    },
    _email() {
      return this.$auth.email;
    },
    _apiUrl() {
      return `https://www.tickspot.com/${this._subscriptionId()}/api/v2`;
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          "Authorization": `Token token=${this._apiToken()}`,
          "User-Agent": `Pipedream (${this._email()})`,
        },
        ...args,
      });
    },
    async getClients({ ...args }) {
      return this._makeRequest({
        path: "/clients.json",
        ...args,
      });
    },
    async getUsers({ ...args }) {
      return this._makeRequest({
        path: "/users.json",
        ...args,
      });
    },
    async getProjects({ ...args }) {
      return this._makeRequest({
        path: "/projects.json",
        ...args,
      });
    },
    async getTasks({ ...args }) {
      return this._makeRequest({
        path: "/tasks.json",
        ...args,
      });
    },
    async getTimeEntries({ ...args }) {
      return this._makeRequest({
        path: "/entries.json",
        ...args,
      });
    },
    async createClient({ ...args }) {
      return this._makeRequest({
        path: "/clients.json",
        method: "post",
        ...args,
      });
    },
    async createProject({ ...args }) {
      return this._makeRequest({
        path: "/projects.json",
        method: "post",
        ...args,
      });
    },
    async createTask({ ...args }) {
      return this._makeRequest({
        path: "/tasks.json",
        method: "post",
        ...args,
      });
    },
    async createTimeEntry({ ...args }) {
      return this._makeRequest({
        path: "/entries.json",
        method: "post",
        ...args,
      });
    },
    async createUser({ ...args }) {
      return this._makeRequest({
        path: "/users.json",
        method: "post",
        ...args,
      });
    },
  },
};
