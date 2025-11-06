import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "form_taxi",
  description: "Receive submissions from Form.taxi",
  // auth: {
  //   type: "custom",
  //   fields: {
  //     form_code: {
  //       type: "string",
  //       label: "Form Code",
  //     },
  //     api_key: {
  //       type: "string",
  //       label: "API Key",
  //       secret: true,
  //     },
  //   },
  // },
  methods: {

    _baseUrl() {
      return `https://form.taxi/int/pipedream`;
    },

    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Accept: "application/json",
          "Content-Type": "application/json",
          "Api-Key": this.$auth.api_key,
        },
        ...opts,
      });
    },

    async createWebhook(hook_url) {
      return this._makeRequest({
        method: "POST",
        path: "/api/"+this.$auth.form_code,
        data: { hook_url },
      });
    },

    async deleteWebhook(id) {
      return this._makeRequest({
        method: "DELETE",
        path: "/api/"+this.$auth.form_code,
        params: {
          hook_id: encodeURIComponent(id)
        }
      });
    },

    async getSampleData() {
      return this._makeRequest({
        method: "GET",
        path: "/api/"+this.$auth.form_code,
      });
    },

    // _apiUrl(form_code) {
    //   return `https://form.taxi/int/pipedream/api/${encodeURIComponent(form_code)}`;
    // },
    // _headers(headers, api_key) {
    //   return {
    //     ...headers,
    //     "Api-Key": api_key,
    //     "Accept": "application/json",
    //     "Content-Type": "application/json",
    //   };
    // },
    // _makeRequest({
    //   $ = this, headers, form_code, api_key, ...opts
    // }) {
    //   return axios($, {
    //     url: this._apiUrl(form_code),
    //     headers: this._headers(headers, api_key),
    //     ...opts,
    //   });
    // },
    // registerWebhook(form_code, api_key, opts = {},) {
    //   return this._makeRequest({
    //     method: "POST",
    //     form_code: form_code,
    //     api_key: api_key,
    //     ...opts,
    //   })
    // },
    // removeWebhook(form_code, api_key, opts = {}) {
    //   return this._makeRequest({
    //     method: "DELETE",
    //     form_code: form_code,
    //     api_key: api_key,
    //     ...opts,
    //   })
    // },
    // loadSampleData(form_code, api_key, opts = {}) {
    //   return this._makeRequest({
    //     method: "GET",
    //     form_code: form_code,
    //     api_key: api_key,
    //     ...opts,
    //   })
    // },
  },
}