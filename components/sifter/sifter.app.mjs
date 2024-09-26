import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sifter",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project Id",
      description: "The ID of the project",
      async options() {
        const resp = await this.getProjects();
        return resp?.projects.map((project) => ({
          label: project.name,
          value: project.url?.substring(project.url.lastIndexOf("/") + 1), //this is because Sifter API does not provide Project ID in the response
        }));
      },
    },
  },
  methods: {
    _getUrl(path) {
      return `https://${this.$auth.account_subdomain}.sifterapp.com/api/${path}`;
    },
    _getHeaders(headers = {}) {
      return {
        "X-Sifter-Token": `${this.$auth.access_key}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    async _makeRequest({
      $,
      path,
      headers,
      ...otherConfig
    } = {}) {
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      };
      return axios($ ?? this, config);
    },
    async getProjects(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/projects",
        ...args,
      });
    },
    async getIssues({
      projectId,
      ...args
    } = {}) {
      return this._makeRequest({
        method: "GET",
        path: `/projects/${projectId}/issues`,
        ...args,
      });
    },
  },
};
