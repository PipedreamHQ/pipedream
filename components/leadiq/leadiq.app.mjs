import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "leadiq",
  methods: {
    _baseUrl() {
      return "https://api.leadiq.com/graphql";
    },
    getAuth() {
      return {
        username: this.$auth.api_key,
        password: "",
      };
    },
    async _makeRequest({
      $ = this, ...args
    } = {}) {
      const response = await axios($, {
        ...args,
        url: this._baseUrl(),
        auth: this.getAuth(),
      });
      if (response?.errors?.length) {
        throw new Error(JSON.stringify(response.errors));
      }
      return response;
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
  },
};
