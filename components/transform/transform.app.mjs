import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "transform",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "The form",
      async options() {
        const { result } = await this.getFormIds();
        return result.map((form) => ({
          label: form.formname,
          value: form.formid,
        }));
      },
    },
  },
  methods: {
    _version() {
      return "transformAPIVersion1.a5svc";
    },
    _baseUrl() {
      return `https://transform.alphasoftware.com/${this._version()}`;
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    async _makeRequest({
      $ = this, path = "", ...opts
    }) {
      const response = await axios($, {
        ...opts,
        url: `${this._baseUrl()}/${path}`,
        headers: {
          ...opts?.headers,
          apikey: this._apiKey(),
        },
      });
      if (response.error) {
        throw new Error(response.errorText);
      }
      return response;
    },
    async getFormIds(opts = {}) {
      const path = "/GetListOfFormDefinitionsForAccount";
      return this._makeRequest({
        ...opts,
        path,
      });
    },
    async getFormResponses({
      formId, ...opts
    }) {
      const path = `/GetFormDataArrayForFormId/${formId}`;
      return this._makeRequest({
        ...opts,
        path,
      });
    },
    async submitForm(opts = {}) {
      const path = "/CreateNewFormInstance";
      return this._makeRequest({
        ...opts,
        method: "POST",
        path,
      });
    },
  },
};
