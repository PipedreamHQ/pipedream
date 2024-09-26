import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "neon_api_keys",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The Neon project ID",
      async options() {
        const { projects } = await this.getProjects();

        return projects.map((project) => ({
          label: project.name,
          value: project.id,
        }));
      },
    },
    branchId: {
      type: "string",
      label: "Branch ID",
      description: "The branch ID",
      async options({ projectId }) {
        const { branches } = await this.getBranches({
          projectId,
        });

        return branches.map((branch) => ({
          label: branch.name,
          value: branch.id,
        }));
      },
    },
    roleName: {
      type: "string",
      label: "Role Name",
      description: "The role name",
      async options({
        projectId, branchId,
      }) {
        const { roles } = await this.getRoles({
          projectId,
          branchId,
        });

        return roles.map((role) => role.name);
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://console.neon.tech/api/v2";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._apiKey()}`,
        },
        ...args,
      });
    },
    async createProject(args = {}) {
      return this._makeRequest({
        path: "/projects",
        method: "post",
        ...args,
      });
    },
    async getProjects(args = {}) {
      return this._makeRequest({
        path: "/projects",
        ...args,
      });
    },
    async createBranch({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/branches`,
        method: "post",
        ...args,
      });
    },
    async getBranches({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/branches`,
        ...args,
      });
    },
    async getRoles({
      projectId, branchId, ...args
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/branches/${branchId}/roles`,
        ...args,
      });
    },
    async createDatabase({
      projectId, branchId, ...args
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/branches/${branchId}/databases`,
        method: "post",
        ...args,
      });
    },
  },
};
