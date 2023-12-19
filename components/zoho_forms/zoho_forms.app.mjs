import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zoho_forms",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form Id",
      description: "The id of the form.",
      async options() {
        const { forms } = await this.listForms();

        return forms.map(({
          form_id: value, display_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    formLinkName: {
      type: "string",
      label: "Form Link Name",
      description: "The link name of the form.",
      async options() {
        const { forms } = await this.listForms();

        return forms.map(({
          link_name: value, display_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://forms.zoho.com/api";
    },
    _headers() {
      return {
        Authorization: `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
      };
    },
    _params(params) {
      return {
        ...params,
        "zf_service": "Pipedream",
      };
    },
    _makeRequest({
      $ = this, path, params, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        params: this._params(params),
        ...opts,
      });
    },
    getFormFields(opts = {}) {
      return this._makeRequest({
        path: "/resthooks/fields",
        ...opts,
      });
    },
    listForms() {
      return this._makeRequest({
        path: "/zforms",
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/resthooks",
        ...opts,
      });
    },
    deleteHook(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/resthooks",
        ...opts,
      });
    },
  },
};
