import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "blink",
  propDefinitions: {
    categoryId: {
      label: "Category ID",
      description: "The ID of the category",
      type: "string",
      async options() {
        const { data: { categories } } = await this.getCategories();

        return categories.map(({
          category_id, description,
        }) => ({
          value: category_id,
          label: description,
        }));
      },
    },
    userId: {
      label: "User ID",
      description: "The ID of the user",
      type: "string",
      async options({ page }) {
        const { data: users } = await this.getUsers({
          params: {
            page: page + 1,
          },
        });

        return users.map(({
          id, display_name,
        }) => ({
          value: id,
          label: display_name,
        }));
      },
    },
  },
  methods: {
    _token() {
      return this.$auth.token;
    },
    _apiUrl() {
      return "https://api.joinblink.com/v2";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        headers: {
          ...args.headers,
          "Authorization": `Bearer ${this._token()}`,
        },
      });
    },
    async postFeed(args = {}) {
      return this._makeRequest({
        path: "/feed/events",
        method: "post",
        ...args,
      });
    },
    async getCategories(args = {}) {
      return this._makeRequest({
        path: "/feed/categories",
        ...args,
      });
    },
    async getUsers(args = {}) {
      return this._makeRequest({
        path: "/user",
        ...args,
      });
    },
    async getFeedEvent(args = {}) {
      return this._makeRequest({
        path: "/feed/event-by-external-id",
        ...args,
      });
    },
  },
};
