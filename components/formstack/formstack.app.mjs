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
    _apiUrlSuffix() {
      return ".json";
    },
    _apiUrl() {
      return "https://www.formstack.com/api/v2";
    },
    async _makeRequest(path, options = {}, $ = this) {
      return axios($, {
        ...options,
        url: `${this._apiUrl()}/${path}${this._apiUrlSuffix()}`,
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
      return this._makeRequest(`form/${formId}/webhook`, {
        method: "post",
        data,
      });
    },
    async removeWebhook(webhookId) {
      return this._makeRequest(`webhooks/${webhookId}`, {
        method: "delete",
      });
    },
    async getAllResources({
      getResourcesFn, $,
    }) {
      let allResources = [];

      let page = 1;

      while (page > 0) {
        const resources = await getResourcesFn({
          page,
          $,
        });

        if (resources?.length >= 100) {
          page++;
        } else {
          page = 0;
        }

        allResources = allResources.concat(resources);
      }

      return allResources;
    },
    async getForms({
      page, $,
    }) {
      const response = await this._makeRequest("form", {
        params: {
          page,
          per_page: 100,
          folders: false,
        },
      }, $);

      return response?.forms ?? [];
    },
    async getForm({
      formId, $,
    }) {
      return this._makeRequest(`form/${formId}`, {}, $);
    },
    async createForm({
      data, $,
    }) {
      return this._makeRequest("form", {
        method: "post",
        data,
      }, $);
    },
    async createSubmission({
      formId, data, $,
    }) {
      return this._makeRequest(`form/${formId}/submission`, {
        method: "post",
        data,
      }, $);
    },
  },
};
