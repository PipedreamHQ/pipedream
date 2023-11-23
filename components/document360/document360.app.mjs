import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "document360",
  propDefinitions: {
    projectVersionId: {
      type: "string",
      label: "Project Version ID",
      description: "Select a Project Version or provide a custom Project Version ID.",
      async options() {
        const versions = await this.getProjectVersions();
        return versions?.data?.map?.((version) => ({
          label: `Version ${version.version_number}: ${version.version_code_name}`,
          value: version.id,
        })) ?? [];
      },
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "Select a Category or provide a custom Category ID.",
      async options({ projectVersionId }) {
        const categories = await this.getCategories(projectVersionId);
        return categories?.data?.map?.(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) ?? [];
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "Select a User or provide a custom User ID.",
      async options() {
        const users = await this.getUsers();
        return users?.result?.map?.((user) => ({
          label: `${user.first_name} ${user.last_name} (${user.email_id})`,
          value: user.user_id,
        })) ?? [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://apihub.document360.io";
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "api_token": this.$auth.api_key,
        },
      });
    },
    async getProjectVersions() {
      return this._makeRequest({
        path: "/v2/ProjectVersions",
      });
    },
    async getUsers() {
      return this._makeRequest({
        path: "/v2/Teams",
      });
    },
    async getCategories(projectVersionId) {
      return this._makeRequest({
        path: `/v2/ProjectVersions/${projectVersionId}/categories`,
      });
    },
    async getArticles(projectVersionId) {
      return this._makeRequest({
        path: `/v2/ProjectVersions/${projectVersionId}/articles`,
      });
    },
    async createDocument(args) {
      return this._makeRequest({
        method: "POST",
        path: "/v2/Articles",
        ...args,
      });
    },
  },
};
