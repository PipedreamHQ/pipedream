import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "byteforms",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form to monitor for new submissions",
      async options() {
        const { data } = await this.listForms();
        return data?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.forms.bytesuite.io/api";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: this.$auth.api_key,
        },
      });
    },
    listForms(opts = {}) {
      return this._makeRequest({
        path: "/form",
        ...opts,
      });
    },
    listFormResponses({
      formId, ...opts
    }) {
      return this._makeRequest({
        path: `/form/responses/${formId}`,
        ...opts,
      });
    },
  },
};
