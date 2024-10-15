import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "paperform",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form to monitor",
      async options() {
        const { results } = await this.listForms();
        return results.map((form) => ({
          label: form.name,
          value: form.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.paperform.co/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async listForms(opts = {}) {
      return this._makeRequest({
        path: "/forms",
        ...opts,
      });
    },
    async getFormSubmissions(formId, opts = {}) {
      return this._makeRequest({
        path: `/forms/${formId}/submissions`,
        ...opts,
      });
    },
  },
};
