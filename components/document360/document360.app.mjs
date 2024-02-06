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
      return "https://apihub.document360.io/v2";
    },
    _makeRequest({
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
    getProjectVersions() {
      return this._makeRequest({
        path: "/ProjectVersions",
      });
    },
    getUsers() {
      return this._makeRequest({
        path: "/Teams",
      });
    },
    getCategories(projectVersionId) {
      return this._makeRequest({
        path: `/ProjectVersions/${projectVersionId}/categories`,
      });
    },
    getArticles(projectVersionId) {
      return this._makeRequest({
        path: `/ProjectVersions/${projectVersionId}/articles`,
      });
    },
    createDocument(args) {
      return this._makeRequest({
        method: "POST",
        path: "/Articles",
        ...args,
      });
    },
  },
};
