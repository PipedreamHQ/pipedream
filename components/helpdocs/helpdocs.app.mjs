import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "helpdocs",
  propDefinitions: {
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "The ID of a category",
      async options() {
        const { categories } = await this.listCategories();
        return categories.map((category) => ({
          label: category.title,
          value: category.category_id,
        }));
      },
    },
    articleId: {
      type: "string",
      label: "Article ID",
      description: "The ID of an article",
      async options({ page }) {
        const { articles } = await this.listArticles({
          params: {
            limit: 20,
            skip: page * 20,
          },
        });
        return articles.map((article) => ({
          label: article.title,
          value: article.article_id,
        }));
      },
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The ID of a permission group",
      async options() {
        const { user_groups: groups } = await this.listGroups();
        return groups.map((group) => ({
          label: group.name,
          value: group.group_id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.helpdocs.io/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    getCategory({
      categoryId, ...opts
    }) {
      return this._makeRequest({
        path: `/category/${categoryId}`,
        ...opts,
      });
    },
    getArticle({
      articleId, ...opts
    }) {
      return this._makeRequest({
        path: `/article/${articleId}`,
        ...opts,
      });
    },
    getArticleVersions({
      articleId, ...opts
    }) {
      return this._makeRequest({
        path: `/article/${articleId}/versions`,
        ...opts,
      });
    },
    listCategories(opts = {}) {
      return this._makeRequest({
        path: "/category",
        ...opts,
      });
    },
    listArticles(opts = {}) {
      return this._makeRequest({
        path: "/article",
        ...opts,
      });
    },
    listGroups(opts = {}) {
      return this._makeRequest({
        path: "/account/group",
        ...opts,
      });
    },
    searchArticles(opts = {}) {
      return this._makeRequest({
        path: "/search",
        ...opts,
      });
    },
    createCategory(opts = {}) {
      return this._makeRequest({
        path: "/category",
        method: "POST",
        ...opts,
      });
    },
    createArticle(opts = {}) {
      return this._makeRequest({
        path: "/article",
        method: "POST",
        ...opts,
      });
    },
    deleteCategory({
      categoryId, ...opts
    }) {
      return this._makeRequest({
        path: `/category/${categoryId}`,
        method: "DELETE",
        ...opts,
      });
    },
    deleteArticle({
      articleId, ...opts
    }) {
      return this._makeRequest({
        path: `/article/${articleId}`,
        method: "DELETE",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, resourceKey, max,
    }) {
      params = {
        ...params,
        limit: 100,
        skip: 0,
      };
      let total, count = 0;
      do {
        const response = await fn({
          params,
        });
        const items = response[resourceKey];
        total = items?.length;
        if (!total) {
          return;
        }
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        params.skip += params.limit;
      } while (total === params.limit);
    },
  },
};
