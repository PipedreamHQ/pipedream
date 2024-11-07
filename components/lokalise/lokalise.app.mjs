import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lokalise",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task",
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the file to be uploaded",
    },
    fileFormat: {
      type: "string",
      label: "File Format",
      description: "The format of the file to be downloaded",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.lokalise.com/api2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createTask(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${this.projectId}/tasks`,
        ...opts,
      });
    },
    async importData(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${this.projectId}/import`,
        ...opts,
      });
    },
    async closeTask(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/projects/${this.projectId}/tasks/${this.taskId}/close`,
        ...opts,
      });
    },
    async initializeProject(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/projects",
        ...opts,
      });
    },
    async uploadFile(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${this.projectId}/files/upload`,
        ...opts,
      });
    },
    async downloadFiles(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${this.projectId}/files/download`,
        ...opts,
      });
    },
  },
};
