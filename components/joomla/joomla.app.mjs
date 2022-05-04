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
          context: prevContext,
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
          context: prevContext,
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
    _buildUrl(context, defaultPath) {
      return Object.keys(context).length > 0
        ? context.next
        : `${this._baseUrl()}${defaultPath}`;
    },
    _getNextLink(links) {
      return links.next
        ? decodeURI(links.next)
        : undefined;
    },
    _baseUrl() {
      return `${this.$auth.joomla_host_domain}/api/index.php/v1`;
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
      $, context = {},
    }) {
      const url = this._buildUrl(context, "/users");
      return this._makeRequest({
        $,
        url,
      });
    },
    async listArticles({
      $, context = {},
    }) {
      const url = this._buildUrl(context, "/content/articles");
      return this._makeRequest({
        $,
        url,
      });
    },
    async createArticle({
      $, data,
    }) {
      return this._makeRequest({
        $,
        url: `${this._baseUrl()}/content/articles`,
        method: "post",
        data,
      });
    },
    async updateArticle({
      $, id, data,
    }) {
      return this._makeRequest({
        $,
        url: `${this._baseUrl()}/content/articles/${id}`,
        method: "patch",
        data,
      });
    },
    async listCategories({
      $, context = {},
    }) {
      const url = this._buildUrl(context, "/content/categories");
      return this._makeRequest({
        $,
        url,
      });
    },
  },
};
