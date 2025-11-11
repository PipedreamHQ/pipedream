import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "form_taxi",
  description: "Emit new event when receive a submission from Form.taxi",
  methods: {
    _baseUrl() {
      return "https://form.taxi/int/pipedream";
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
        path: "/api/" + this.$auth.form_code,
        data: {
          hook_url,
        },
      });
    },
    async deleteWebhook(id) {
      return this._makeRequest({
        method: "DELETE",
        path: "/api/" + this.$auth.form_code,
        params: {
          "hook_id": encodeURIComponent(id),
        },
      });
    },
    async getSampleData() {
      return this._makeRequest({
        method: "GET",
        path: "/api/" + this.$auth.form_code,
      });
    },
  },
};
