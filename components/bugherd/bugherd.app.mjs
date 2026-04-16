import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bugherd",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
      async options() {
        const { projects } = await this.listProjects();
        return projects.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task",
      async options({ projectId }) {
        const { tasks } = await this.listTasks({
          projectId,
        });
        return tasks.map(({
          id, description,
        }) => ({
          label: description,
          value: id,
        }));
      },
    },
    assignedToEmail: {
      type: "string",
      label: "Assigned To Email",
      description: "The email of the user to assign the task to. Set to null to unassign all users. It needs to be of a current project member",
      async options({ projectId }) {
        const { project: { members } } = await this.getProject({
          projectId,
        });
        return members.map(({ email }) => email);
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://www.bugherd.com/api_v2";
    },
    _getAuth() {
      return {
        username: this.$auth.api_key,
        password: "x",
      };
    },
    _getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${this._getBaseUrl()}${path}`,
        headers: this._getHeaders(headers),
        auth: this._getAuth(),
        ...opts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects.json",
        ...opts,
      });
    },
    listTasks({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/tasks.json`,
        ...opts,
      });
    },
    getProject({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}.json`,
        ...opts,
      });
    },
    createProject(opts = {}) {
      return this._makeRequest({
        path: "/projects.json",
        method: "POST",
        ...opts,
      });
    },
    updateTask({
      projectId, taskId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/tasks/${taskId}.json`,
        method: "PUT",
        ...opts,
      });
    },
    uploadAttachment({
      $, projectId, taskId, ...opts
    }) {
      return this._makeRequest({
        $,
        path: `/projects/${projectId}/tasks/${taskId}/attachments/upload`,
        method: "POST",
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/webhooks.json",
        method: "POST",
      });
    },
    deleteHook(webhookId) {
      return this._makeRequest({
        path: `/webhooks/${webhookId}.json`,
        method: "DELETE",
      });
    },
  },
};
