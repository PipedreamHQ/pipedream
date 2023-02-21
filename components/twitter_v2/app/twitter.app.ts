import { defineApp } from "@pipedream/types";
import twitter from "../../twitter/twitter.app.mjs";

export default defineApp({
  type: "app",
  app: "twitter",
  propDefinitions: {
    ...twitter.propDefinitions,
  },
  methods: {
    _baseUrl(): string {
      return "https://api.profitwell.com/v2";
    },
    async _httpRequest({
      $ = this,
      endpoint,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        url: this._baseUrl() + endpoint,
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.$auth.api_token,
        },
        ...args,
      });
    },
    async addUserToList(opts = {}) {

    }
  },
});