import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "byteforms",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form to monitor for new submissions",
      required: true,
    },
    submissionDataFields: {
      type: "string[]",
      label: "Submission Data Fields",
      description: "The data fields to include in the submission",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.forms.bytesuite.io";
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
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async getForm(formId) {
      return this._makeRequest({
        path: `/api/form/${formId}`,
      });
    },
    async getFormResponses(formId, opts = {}) {
      return this._makeRequest({
        path: `/api/form/responses/${formId}`,
        ...opts,
      });
    },
    async emitEvent(formId, submissionDataFields) {
      const response = await this.getFormResponses(formId);
      this.$emit(response, {
        summary: `New submission for form ${formId}`,
        id: response.id,
        ts: Date.now(),
      });
    },
  },
};
