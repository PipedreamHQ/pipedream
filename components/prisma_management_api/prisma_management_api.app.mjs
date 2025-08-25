import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "prisma_management_api",
  propDefinitions: {
    region: {
      type: "string",
      label: "Region",
      description: "The region where the database should be created",
      async options() {
        const response = await this.listRegions();
        const regions = response?.data || [];
        return regions
          .filter((region) => !region.status || region.status === "available")
          .map((region) => ({
            label: region.name || region.id,
            value: region.id,
          }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.prisma.io/v1";
    },
    _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_token}`,
          "Content-Type": "application/json",
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
    async deleteProject({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}`,
        method: "delete",
        ...args,
      });
    },
    async listProjects(args = {}) {
      return this._makeRequest({
        path: "/projects",
        method: "get",
        ...args,
      });
    },
    async getProject({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}`,
        method: "get",
        ...args,
      });
    },
    async createDatabase({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/databases`,
        method: "post",
        ...args,
      });
    },
    async listDatabases({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/databases`,
        method: "get",
        ...args,
      });
    },
    async getDatabase({
      databaseId, ...args
    }) {
      return this._makeRequest({
        path: `/databases/${databaseId}`,
        method: "get",
        ...args,
      });
    },
    async deleteDatabase({
      databaseId, ...args
    }) {
      return this._makeRequest({
        path: `/databases/${databaseId}`,
        method: "delete",
        ...args,
      });
    },
    async listConnectionStrings({
      databaseId, ...args
    }) {
      return this._makeRequest({
        path: `/databases/${databaseId}/connections`,
        method: "get",
        ...args,
      });
    },
    async createConnectionString({
      databaseId, data, ...args
    }) {
      return this._makeRequest({
        path: `/databases/${databaseId}/connections`,
        method: "post",
        data: data || {},
        ...args,
      });
    },
    async deleteConnectionString({
      connectionId, ...args
    }) {
      return this._makeRequest({
        path: `/connections/${connectionId}`,
        method: "delete",
        ...args,
      });
    },
    async listRegions(args = {}) {
      return this._makeRequest({
        path: "/regions/postgres",
        method: "get",
        ...args,
      });
    },
  },
};