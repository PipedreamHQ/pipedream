import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "spoonacular",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.spoonacular.com";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        params: {
          ...args.params,
          apiKey: this._apiKey(),
        },
      });
    },
    createMealPlan(args = {}) {
      return this._makeRequest({
        path: "/mealplanner/generate",
        ...args,
      });
    },
    convertMeasurements(args = {}) {
      return this._makeRequest({
        path: "/recipes/convert",
        ...args,
      });
    },
    searchRecipes(args = {}) {
      return this._makeRequest({
        path: "/recipes/findByIngredients",
        ...args,
      });
    },
  },
};
