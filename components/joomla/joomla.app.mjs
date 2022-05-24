import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "joomla",
  propDefinitions: {
    articleId: {
      type: "string",
      label: "Article ID",
      description: "The article ID",
      async options({ prevContext }) {
        const {
          links,
          data,
        } = await this.listArticles({
          nextLink: prevContext.next,
        });
        return {
          options: data.map((article) => ({
            label: article.attributes.title,
            value: article.id,
          })),
          context: {
            next: this._getNextLink(links),
          },
        };
      },
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "The category ID",
      async options({ prevContext }) {
        const {
          links,
          data,
        } = await this.listCategories({
          nextLink: prevContext.next,
        });
        return {
          options: data.map((category) => ({
            label: category.attributes.title,
            value: category.id,
          })),
          context: {
            next: this._getNextLink(links),
          },
        };
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the article",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text of the article",
    },
  },
  methods: {
    _getNextLink(links) {
      return links.next
        ? decodeURI(links.next)
        : undefined;
    },
    _baseUrl() {
      return `${this.$auth.joomla_host_domain.replace(/\/$/, "")}/api/index.php/v1`;
    },
    _usersUrl() {
      return `${this._baseUrl()}/users`;
    },
    _articlesUrl() {
      return `${this._baseUrl()}/content/articles`;
    },
    _categoriesUrl() {
      return `${this._baseUrl()}/content/categories`;
    },
    _headers() {
      return {
        "X-Joomla-Token": `${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $, url, method = "get", params = {}, data = {},
    }) {
      try {
        return await axios($ ?? this, {
          headers: this._headers(),
          url,
          method,
          params,
          data,
        });
      } catch (e) {
        throw new Error(JSON.stringify(e.response.data.errors));
      }
    },
    async *paginate({
      $, url, params,
    }) {
      let next = url;
      do {
        const {
          links,
          data,
        } = await this._makeRequest({
          $,
          url: next,
          params,
        });

        for (const d of data) {
          yield d;
        }

        next = this._getNextLink(links);
      } while (next);
    },
    async iterateGenerator(generator) {
      const data = [];
      for await (const d of generator) {
        data.push(d);
      }
      return data;
    },
    async listUsers({
      $, nextLink,
    }) {
      return this._makeRequest({
        $,
        url: nextLink ?? this._usersUrl(),
      });
    },
    async listArticles({
      $, nextLink,
    }) {
      return this._makeRequest({
        $,
        url: nextLink ?? this._articlesUrl(),
      });
    },
    async createArticle({
      $, data,
    }) {
      return this._makeRequest({
        $,
        url: this._articlesUrl(),
        method: "post",
        data,
      });
    },
    async updateArticle({
      $, id, data,
    }) {
      return this._makeRequest({
        $,
        url: `${this._articlesUrl()}/${id}`,
        method: "patch",
        data,
      });
    },
    async listCategories({
      $, nextLink,
    }) {
      return this._makeRequest({
        $,
        url: nextLink ?? this._categoriesUrl(),
      });
    },
  },
};
