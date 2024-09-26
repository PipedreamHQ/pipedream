import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "jooto",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "ID of the Project",
      async options() {
        const response = await this.getProjects({});
        const projectsIds = response.boards;
        return projectsIds.map(({
          id, title,
        }) => ({
          value: id,
          label: title,
        }));
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "ID of the Task",
      async options({ projectId }) {
        const response = await this.getTasks({
          id: projectId,
        });
        const tasksIds = response.tasks;
        return tasksIds.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        }));
      },
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "ID of the List",
      async options({ projectId }) {
        const response = await this.getLists({
          id: projectId,
        });
        const listsIds = response.lists;
        return listsIds.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        }));
      },
    },
    userId: {
      type: "string[]",
      label: "Assigned Users IDs",
      description: "The ID of the assigned users",
      async options() {
        const response = await this.getUsers();
        const usersIds = response.users;
        return usersIds.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        }));
      },
    },
    taskName: {
      type: "string",
      label: "Task Name",
      description: "Name of the Task",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the Task",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.jooto.com/v1";
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
          "X-Jooto-Api-Key": `${this.$auth.api_key}`,
        },
      });
    },
    async createTask({
      id, ...args
    }) {
      return this._makeRequest({
        method: "post",
        path: `/boards/${id}/tasks`,
        ...args,
      });
    },
    async getProjects(args = {}) {
      return this._makeRequest({
        path: "/boards",
        ...args,
      });
    },
    async updateTask({
      id, task_id, ...args
    }) {
      return this._makeRequest({
        method: "patch",
        path: `/boards/${id}/tasks/${task_id}`,
        ...args,
      });
    },
    async getTasks({
      id, ...args
    }) {
      return this._makeRequest({
        path: `/boards/${id}/tasks`,
        ...args,
      });
    },
    async getLists({
      id, ...args
    }) {
      return this._makeRequest({
        path: `/boards/${id}/lists`,
        ...args,
      });
    },
    async getUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
  },
};
