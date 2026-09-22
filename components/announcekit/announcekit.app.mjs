import { axios } from "@pipedream/platform";
import queries from "./common/queries.mjs";

export default {
  type: "app",
  app: "announcekit",
  propDefinitions: {
    projectId: {
      type: "integer",
      label: "Project ID",
      description: "The ID of the project",
      async options() {
        const { data } = await this.listProjects();

        return data?.me?.memberships?.map((membership) => ({
          label: membership.project.name,
          value: parseInt(membership.project.id),
        }));
      },
    },
    labels: {
      type: "integer[]",
      label: "Labels",
      description: "A list of label IDs to attach to the post",
      async options({ projectId }) {
        const { data } = await this.listLabels({
          projectId,
        });

        return data?.project?.labels?.map((label) => ({
          label: label.name,
          value: parseInt(label.id),
        }));
      },
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "The locale of the post.",
      async options() {
        const { data } = await this.listLocales();
        return data?.locales?.map((locale) => ({
          label: locale.name,
          value: locale.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://announcekit.app/gq/v2";
    },
    _getAuth() {
      return {
        username: this.$auth.email,
        password: this.$auth.password,
      };
    },
    _makeRequest({
      $ = this,
      ...args
    } = {}) {
      return axios($, {
        url: this._baseUrl(),
        auth: this._getAuth(),
        method: "POST",
        ...args,
      });
    },
    async query({
      query,
      variables = {},
      ...args
    } = {}) {
      return this._makeRequest({
        data: {
          query,
          variables,
        },
        ...args,
      });
    },
    listProjects() {
      return this._makeRequest({
        data: {
          query: queries.listProjects,
        },
      });
    },
    listLabels(variables) {
      return this._makeRequest({
        data: {
          query: queries.listLabels,
          variables,
        },
      });
    },
    listLocales() {
      return this._makeRequest({
        data: {
          query: queries.listLocales,
        },
      });
    },
    listPosts(variables) {
      return this._makeRequest({
        data: {
          query: queries.listPosts,
          variables,
        },
      });
    },
    listActivities(variables) {
      return this._makeRequest({
        data: {
          query: queries.listActivities,
          variables,
        },
      });
    },
    createPost(variables) {
      return this._makeRequest({
        data: {
          query: queries.createPost,
          variables,
        },
      });
    },
    async mutation({
      mutation,
      variables = {},
      ...args
    } = {}) {
      return this._makeRequest({
        data: {
          query: mutation,
          variables,
        },
        ...args,
      });
    },
    async *paginate({
      fn, variables = {}, itemsField, maxResults = null,
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        variables.page = page++;
        const { data } = await fn(variables);
        const items = data[itemsField].items || data[itemsField].list;

        for (const d of items) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data[itemsField].page < data[itemsField].pages;

      } while (hasMore);
    },
  },
};
