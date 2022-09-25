import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";

export default defineApp({
  type: "app",
  app: "repuso",
  methods: {
    _baseUrl(): string {
      return "https://api.repuso.com/public/v1/";
    },
    async _httpRequest({
      $ = this,
      endpoint,
      ...args
    }): Promise<object> {
      return axios($, {
        url: this._baseUrl() + endpoint,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...args,
      });
    },
    async addInviteRequest(
      params,
    ) {
      return this._httpRequest({
        endpoint: "invite/requests/add",
        method: 'POST',
        ...params,
      });
    },
  },
});
