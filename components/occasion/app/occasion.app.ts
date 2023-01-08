import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import { HttpRequestParams, OccasionResponse, Order } from "../common/types";

export default defineApp({
  type: "app",
  app: "practitest",
  methods: {
    _getAuth(): Record<string, string> {
      return {
        username: this.$auth.api_login,
        password: this.$auth.api_secret,
      };
    },
    _baseUrl() {
      return "https://app.getoccasion.com/api/v1";
    },
    async _httpRequest({
      $ = this,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        baseURL: this._baseUrl(),
        auth: this._getAuth(),
        ...args,
      });
    },
    async getOrders(): Promise<Order[]> {
      const { data }: OccasionResponse = await this._httpRequest({
        url: "/orders",
      });
      return data;
    },
  },
});
