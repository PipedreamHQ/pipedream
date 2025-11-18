import { axios } from "@pipedream/platform";

export default {
  propDefinitions: {},
  type: "app",
  app: "form_taxi",
  methods: {
    _baseUrl() {
      return "https://form.taxi/int/pipedream/api/";
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Api-Key": this.$auth.api_key,
        },
        ...opts,
      });
    },
    async createWebhook(hook_url) {
      return this._makeRequest({
        method: "POST",
        path: this.$auth.form_code,
        data: {
          hook_url,
        },
      });
    },
    async deleteWebhook(id) {
      return this._makeRequest({
        method: "DELETE",
        path: this.$auth.form_code,
        params: {
          "hook_id": id,
        },
      });
    },
    async getSampleData() {
      return this._makeRequest({
        method: "GET",
        path: this.$auth.form_code,
      });
    },
  },
};
