import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fillout",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form",
      async options() {
        const forms = await this.getForms();
        return forms.map((form) => ({
          label: form.name,
          value: form.formId,
        }));
      },
    },
    form: {
      type: "string",
      label: "Form",
      description: "The form to be sent",
      async options() {
        const forms = await this.getForms();
        return forms.map((form) => ({
          label: form.name,
          value: form.formId,
        }));
      },
    },
    email: {
      type: "string[]",
      label: "Email Address List",
      description: "The list of email addresses to send the form to",
    },
    cc: {
      type: "string[]",
      label: "CC",
      description: "The list of email addresses to CC",
      optional: true,
    },
    bcc: {
      type: "string[]",
      label: "BCC",
      description: "The list of email addresses to BCC",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.fillout.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getForms() {
      return this._makeRequest({
        path: "/forms",
      });
    },
    async getFormSubmissions({
      formId, ...opts
    }) {
      return this._makeRequest({
        path: `/forms/${formId}/submissions`,
        ...opts,
      });
    },
    async createWebhook({
      formId, url, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook/create",
        data: {
          formId,
          url,
        },
        ...opts,
      });
    },
    async deleteWebhook({
      webhookId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook/delete",
        data: {
          webhookId,
        },
        ...opts,
      });
    },
    async sendForm({
      form, email, cc, bcc, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/forms/send",
        data: {
          form,
          email,
          cc,
          bcc,
        },
        ...opts,
      });
    },
  },
};
