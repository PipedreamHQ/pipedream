import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "swagup",
  propDefinitions: {
    category: {
      type: "string",
      label: "Product Category",
      description: "The ID of a list of items in the catalog",
      async options({ prevContext }) {
        const limit = constants.ASYNC_OPTIONS_LIMIT;
        const offset = prevContext?.offset || 0;
        const { results } = await this.listProductCategories({
          params: {
            offset,
            limit,
          },
        });
        return {
          options: results.map((category) => ({
            label: category.CatName,
            value: category.id,
          })),
          context: {
            offset: offset + limit,
          },
        };
      },
    },
    product: {
      type: "string",
      label: "Product",
      description: "The ID of a product",
      async options({ category }) {
        const { results } = await this.listProducts({
          category,
        });
        return results.map((product) => ({
          label: product.name,
          value: product.id,
        }));
      },
    },
  },
  methods: {
    _auth() {
      return this.$auth.oauth_access_token;
    },
    _baseUrl() {
      return "https://api.swagup.com";
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        headers: {
          ...opts.headers,
          Authorization: `Bearer ${this._auth()}`,
        },
        url: this._baseUrl() + path,
        ...opts,
      });
    },
    async listProductCategories({
      paginate = false, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          fn: this.listProductCategories,
          ...opts,
        });
      }
      return this._makeRequest({
        path: "/form-api/v1/categories",
        ...opts,
      });
    },
    async listProducts({
      category, ...opts
    }) {
      let items;
      const { results } = await this.listProductCategories({
        ...opts,
        paginate: true,
      });

      if (category) {
        items = results.filter((result) => result.id == category)[0]?.items;
      } else {
        items = results.reduce((acc, category) => ([
          ...acc,
          ...category.items,
        ]), []);
      }

      return {
        results: items || [],
      };
    },
    async paginate({
      fn, ...opts
    }) {
      const limit = constants.MAX_LIMIT;
      let offset = 0;
      const objects = [];

      while (true) {
        const { results } = await fn.call(this, {
          ...opts,
          params: {
            ...opts?.params,
            limit,
            offset,
          },
        });

        if (results.length === 0) break;
        objects.push(...results);
        offset += limit;
      }
      return {
        results: objects,
      };
    },
  },
};
