import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import { HttpRequestParams } from "../common/types";

export default defineApp({
  type: "app",
  app: "currencyscoop",
  methods: {
    async _httpRequest<ResponseType extends object>({
      $ = this,
      params,
      ...args
    }: HttpRequestParams): Promise<ResponseType> {
      const { api_key } = this.$auth;
      return axios($, {
        baseURL: "https://api.currencybeacon.com/v1",
        params: {
          ...params,
          api_key,
        },
        ...args,
      });
    },
  },
});
