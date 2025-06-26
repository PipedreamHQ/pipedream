import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tettra",
  propDefinitions: {
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "Select a category or provide a category ID",
      optional: true,
      async options() {
        const { categories } = await this.getCategories();
        return categories.map((category) => ({
          label: category.name,
          value: category.id,
        }));
      },
    },
    subcategoryId: {
      type: "string",
      label: "Subcategory ID",
      description: "Select a subcategory or provide a subcategory ID",
      optional: true,
      async options({ categoryId }) {
        const { categoryItems } = await this.getCategory(categoryId);
        return categoryItems.filter((item) => item.type === "Subcategory").map((item) => ({
          label: item.title,
          value: item.id,
        }));
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "Select a user or provide a user ID",
      optional: true,
      async options() {
        const { users } = await this.getUsers();
        return users.map((user) => ({
          label: user.display_name ?? user.email,
          value: user.id,
        }));
      },
    },
  },
  methods: {
    async _makeRequest({
      $ = this,
      data,
      ...args
    }) {
      const response = await axios($, {
        baseURL: `https://app.tettra.co/api/teams/${this.$auth.team_id}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          ...data,
          api_key: this.$auth.api_key,
        },
        ...args,
      });
      return response;
    },
    async createPage(args) {
      return this._makeRequest({
        url: "/pages",
        method: "POST",
        ...args,
      });
    },
    async suggestPage(args) {
      return this._makeRequest({
        url: "/suggestions",
        method: "POST",
        ...args,
      });
    },
    async getCategories() {
      return this._makeRequest({
        url: "/categories",
      });
    },
    async getCategory(categoryId) {
      return this._makeRequest({
        url: `/categories/${categoryId}`,
      });
    },
    async getUsers() {
      return this._makeRequest({
        url: "/users",
      });
    },
  },
};
