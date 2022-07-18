import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";

export default defineApp({
  type: "app",
  app: "namely",
  propDefinitions: {},
  methods: {
    _subdomain() {
      return this.$auth.subdomain;
    },
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return `https://${this._subdomain()}.namely.com/api/v1`;
    },
    async _makeRequest(path, options = {}, $ = undefined) {
      return axios($ ?? this, {
        url: `${this._apiUrl()}/${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...options,
      });
    },
    async createUser({
      $, data,
    }) {
      return this._makeRequest("profiles", {
        method: "post",
        data: {
          profiles: [
            data,
          ],
        },
      }, $);
    },
  },
});
