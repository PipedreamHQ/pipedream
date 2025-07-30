import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "browserbase",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
      async options() {
        const projects = await this.listProjects();
        return projects.map((project) => ({
          value: project.id,
          label: project.name,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.browserbase.com/v1";
    },
    _headers() {
      return {
        "x-bb-api-key": `${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        ...opts,
      });
    },
    listSessions(opts = {}) {
      return this._makeRequest({
        path: "/sessions",
        ...opts,
      });
    },
    createSession(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sessions",
        ...opts,
      });
    },
    createContext(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contexts",
        ...opts,
      });
    },
  },
};
