import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "formstack",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Forms",
      description: "Select a form",
      async options({ page }) {
        const forms = await this.getForms({
          page: page + 1,
        });

        return forms.map((form) => ({
          label: form.name,
          value: form.id,
        }));
      },
    },
  },
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://www.formstack.com/api/v2";
    },
    async _makeRequest(path, options = {}, $ = this) {
      return axios($, {
        ...options,
        url: `${this._apiUrl()}/${path}`,
        headers: {
          ...options.headers,
          "Authorization": `Bearer ${this._accessToken()}`,
          "Content-Type": "application/json",
        },
      });
    },
    async createWebhook({
      formId, data,
    }) {
      return this._makeRequest(`form/${formId}/webhook.json`, {
        method: "post",
        data: {
          ...data,
          content_type: "json",
          handshake_key: this._accessToken(),
        },
      });
    },
    async removeWebhook(webhookId) {
      return this._makeRequest(`webhooks/${webhookId}.json`, {
        method: "delete",
      });
    },
    async getForms({ $ }) {
      let allForms = [];

      let page = 1;

      while (page > 0) {
        const response = await this._makeRequest("form.json", {
          params: {
            page,
            per_page: 100,
            folders: false,
          },
        }, $);

        if (response.forms.length >= 100) {
          page++;
        } else {
          page = 0;
        }

        allForms = allForms.concat(response.forms);
      }

      return allForms;
    },
    async getForm({
      formId, $,
    }) {
      return this._makeRequest(`form/${formId}.json`, {}, $);
    },

    async createSubmission({
      formId, data, $,
    }) {
      return this._makeRequest(`form/${formId}/submission.json`, {
        method: "post",
        data,
      }, $);
    },
    async createForm({
      data, $,
    }) {
      return this._makeRequest("form.json", {
        method: "post",
        data,
      }, $);
    },
  },
};
