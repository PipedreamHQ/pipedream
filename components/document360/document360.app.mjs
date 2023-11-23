import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "document360",
  propDefinitions: {
    projectVersionId: {
      type: "string",
      label: "Project Version",
      description: "Select the project version.",
      async options() {
        const versions = await this.getProjectVersions();
        return versions.map((version) => ({
          label: `Version ${version.version_number}: ${version.version_code_name}`,
          value: version.id,
        }));
      },
    },
    articleId: {
      type: "string",
      label: "Article",
      description: "Select the article to publish.",
      async options({ projectVersionId }) {
        const articles = await this.getArticles({
          projectVersionId,
        });
        return articles.map((article) => ({
          label: article.title,
          value: article.id,
        }));
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
          "api_token": this.$auth.api_token,
        },
      });
    },
    async getProjectVersions() {
      return this._makeRequest({
        path: "/v2/ProjectVersions",
      });
    },
    async getArticles({ projectVersionId }) {
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
    // Additional method to fulfill the requirement of emitting new article events
    // async watchNewArticles({
    //   projectVersionId, after,
    // }) {
    // Implementation to watch for new articles within a project version
    // after a specific timestamp or ID
    // },
  },
};
