import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "help_scout_api_keys",
  propDefinitions: {
    collectionId: {
      type: "string",
      label: "Collection ID",
      description: "The ID of a collection",
      async options({ page }) {
        const { collections: { items } } = await this.listCollections({
          params: {
            page: page + 1,
          },
        });
        return items?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "The ID of a category",
      async options({
        page, collectionId,
      }) {
        if (!collectionId) {
          return [];
        }
        const { categories: { items } } = await this.listCategories({
          collectionId,
          params: {
            page: page + 1,
          },
        });
        return items?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    articleId: {
      type: "string",
      label: "Article ID",
      description: "The ID or number of an article",
      async options({
        page, collectionId, categoryId,
      }) {
        if (!collectionId && !categoryId) {
          return [];
        }
        const params = {
          page: page + 1,
        };
        const { articles: { items } } = categoryId
          ? await this.listArticlesByCategory({
            categoryId,
            params,
          })
          : await this.listArticlesByCollection({
            collectionId,
            params,
          });
        return items?.map(({
          id: value,
          name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    siteId: {
      type: "string",
      label: "Site ID",
      description: "The ID of a site",
      async options({ page }) {
        const { sites: { items } } = await this.listSites({
          params: {
            page: page + 1,
          },
        });
        return items?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to retrieve",
      optional: true,
      default: 1,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the articles to retrieve",
      options: [
        "all",
        "published",
        "notpublished",
      ],
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://docsapi.helpscout.net/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: {
          username: `${this.$auth.api_key}`,
          password: "X",
        },
        ...opts,
      });
    },
    getArticle({
      articleId, ...opts
    }) {
      return this._makeRequest({
        path: `/articles/${articleId}`,
        ...opts,
      });
    },
    listCollections(opts = {}) {
      return this._makeRequest({
        path: "/collections",
        ...opts,
      });
    },
    listCategories({
      collectionId, ...opts
    }) {
      return this._makeRequest({
        path: `/collections/${collectionId}/categories`,
        ...opts,
      });
    },
    listSites(opts = {}) {
      return this._makeRequest({
        path: "/sites",
        ...opts,
      });
    },
    listArticlesByCollection({
      collectionId, ...opts
    }) {
      return this._makeRequest({
        path: `/collections/${collectionId}/articles`,
        ...opts,
      });
    },
    listArticlesByCategory({
      categoryId, ...opts
    }) {
      return this._makeRequest({
        path: `/categories/${categoryId}/articles`,
        ...opts,
      });
    },
    searchArticles(opts = {}) {
      return this._makeRequest({
        path: "/search/articles",
        ...opts,
      });
    },
  },
};
