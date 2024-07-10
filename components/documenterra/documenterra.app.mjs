import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "documenterra",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project Identity",
      description: "The unique identifier for the project.",
      async options({ filter = () => true }) {
        const response = await this.listProjects();
        return response
          ?.filter(filter)
          .map(({
            id: value, title: label,
          }) => ({
            label,
            value,
          }));
      },
    },
    pageId: {
      type: "string",
      label: "Page ID",
      description: "The unique identifier for the page.",
      async options({ projectId }) {
        if (!projectId) {
          return [];
        }
        const response = await this.listPages({
          projectId,
        });
        return response?.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    outputFileName: {
      type: "string",
      label: "Output File Name",
      description: "The full file name, including the file path starting with `Storage/` Eg. `Storage/Backups/Project-backup_2023-03-13_03-46-07.zip`",
    },
  },
  methods: {
    getBaseUrl() {
      const { portal_url: baseUrl } = this.$auth;
      return baseUrl.endsWith("/")
        ? baseUrl.slice(0, -1)
        : baseUrl;
    },
    getUrl(path) {
      return `${this.getBaseUrl()}/api/v1${path}`;
    },
    getAuth() {
      const {
        email: username,
        api_key: password,
      } = this.$auth;
      return {
        username,
        password,
      };
    },
    _makeRequest({
      $ = this, path, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        auth: this.getAuth(),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    createProject({
      projectId, ...args
    } = {}) {
      return this.post({
        path: `/projects/${projectId}`,
        ...args,
      });
    },
    listProjects(args = {}) {
      return this._makeRequest({
        path: "/projects",
        ...args,
      });
    },
    listPages({
      projectId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/articles`,
        ...args,
      });
    },
  },
};
