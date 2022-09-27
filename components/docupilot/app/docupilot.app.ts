import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";

export default defineApp({
  type: "app",
  app: "docupilot",
  methods: {
    _baseUrl(): string {
      return "https://api.docupilot.app/api/v1";
    },
    async _httpRequest({
      $ = this,
      endpoint,
      ...args
    }): Promise<object> {
      return axios($, {
        url: this._baseUrl() + endpoint,
        headers: {
          "apikey": this.$auth.api_key,
        },
        ...args,
      });
    },
  },
});
