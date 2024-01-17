import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "surveycto",
  propDefinitions: {
    formName: {
      type: "string",
      label: "Form Name",
      description: "The name of the form",
      required: true,
    },
    submissionId: {
      type: "string",
      label: "Submission ID",
      description: "The ID of the form submission",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.surveycto.com";
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
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    async getFormData(formName, opts = {}) {
      return this._makeRequest({
        path: `/v2/forms/data/${formName}`,
        ...opts,
      });
    },
    async getSubmissionData(formName, submissionId, opts = {}) {
      return this._makeRequest({
        path: `/v2/forms/data/${formName}/${submissionId}`,
        ...opts,
      });
    },
    async submitForm(formData) {
      return this._makeRequest({
        method: "POST",
        path: "/forms/submit",
        data: formData,
      });
    },
  },
};
