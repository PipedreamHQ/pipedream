import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 20;

export default {
  type: "app",
  app: "insightly",
  propDefinitions: {
    categoryId: {
      type: "string",
      label: "Category",
      description: "Identifier of a task category",
      optional: true,
      async options({ page }) {
        const top = DEFAULT_LIMIT;
        const params = {
          top,
          skip: page * top,
        };
        const categories = await this.listTaskCategories({
          params,
        });
        return categories?.map(({
          CATEGORY_ID: value, CATEGORY_NAME: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://api.${this.$auth.pod}.insightly.com/v3.1`;
    },
    _auth() {
      return {
        username: `${this.$auth.api_key}`,
        password: "",
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: this._auth(),
        ...args,
      });
    },
    listTaskCategories(args = {}) {
      return this._makeRequest({
        path: "/TaskCategories",
        ...args,
      });
    },
    createContact(args = {}) {
      return this._makeRequest({
        path: "/Contacts",
        method: "POST",
        ...args,
      });
    },
    createTask(args = {}) {
      return this._makeRequest({
        path: "/Tasks",
        method: "POST",
        ...args,
      });
    },
  },
};
