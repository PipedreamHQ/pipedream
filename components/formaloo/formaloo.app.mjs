import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "formaloo",
  propDefinitions: {
    formSlug: {
      type: "string",
      label: "Form Slug",
      description: "The slug of the form you want to add tags to.",
      async options({ page }) {
        const { data: { forms } } = await this.listForms({
          params: {
            page: page + 1,
          },
        });
        return forms.map(({
          slug: value, title: label,
        }) => ({
          label: label || value,
          value,
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.formaloo.net/v2.0${path}`;
    },
    _getHeaders() {
      return {
        "Authorization": `JWT ${this.$auth.oauth_access_token}`,
        "x-api-key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this.getUrl(path),
        headers: this._getHeaders(),
        ...opts,
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    listForms(args = {}) {
      return this._makeRequest({
        path: "/forms/",
        ...args,
      });
    },
  },
};
