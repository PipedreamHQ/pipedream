import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import { HttpRequestParams } from "../common/types";

export default defineApp({
  type: "app",
  app: "raven_tools",
  methods: {
    _baseUrl() {
      return "https://api.raventools.com/api";
    },
    async _httpRequest({
      $ = this,
      params,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        baseURL: this._baseUrl(),
        params: {
          ...params,
          key: this.$auth.api_key,
          method: "profile_info",
          format: "json",
        },
        ...args,
      });
    },
  },
});
