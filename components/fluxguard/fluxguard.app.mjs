import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fluxguard",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the Fluxguard project.",
      async options() {
        const projects = await this.listProjects();
        return projects.map((project) => ({
          label: project.name,
          value: project.id,
        }));
      },
    },
    checkId: {
      type: "string",
      label: "Check ID",
      description: "The ID of the check within the project.",
      async options({ projectId }) {
        const checks = await this.listChecks({
          projectId,
        });
        return checks.map((check) => ({
          label: check.name,
          value: check.id,
        }));
      },
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.fluxguard.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async listProjects() {
      return this._makeRequest({
        path: "/projects",
      });
    },
    async listChecks({ projectId }) {
      return this._makeRequest({
        path: `/projects/${projectId}/checks`,
      });
    },
    async detectChanges({
      projectId, checkId,
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/checks/${checkId}/changes`,
        method: "POST",
      });
    },
    async paginate(fn, ...opts) {
      let results = [];
      let response;
      do {
        response = await fn(...opts);
        results = results.concat(response.items);
        if (response.pagination && response.pagination.next) {
          opts[0] = {
            ...opts[0],
            page: response.pagination.next,
          };
        }
      } while (response.pagination && response.pagination.next);
      return results;
    },
  },
  version: `0.0.${new Date().getTime()}`,
};
