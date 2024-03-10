import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "formcan",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form to be submitted or to retrieve fields from.",
    },
    formData: {
      type: "object",
      label: "Form Data",
      description: "The data to be filled in the form. Should be an object where each key is the field ID and each value is the field value or raw input.",
      optional: true,
    },
    submissionTime: {
      type: "string",
      label: "Submission Time",
      description: "The time the form was submitted, in ISO 8601 format",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.formcan.com/v4";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        data,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
        params,
      });
    },
    async getFormFields({ formId }) {
      return this._makeRequest({
        path: `/form/${formId}/fields`,
      });
    },
    async submitForm({
      formId, formData,
    }) {
      const submissionData = formData
        ? {
          submit_data: Object.keys(formData).map((key) => ({
            id: key,
            ...(typeof formData[key] === "string" || typeof formData[key] === "number"
              ? {
                value: formData[key],
              }
              : {
                raw: formData[key],
              }),
          })),
        }
        : {};
      return this._makeRequest({
        method: "POST",
        path: `/submit/form/${formId}/`,
        data: submissionData,
      });
    },
    async updateForm({
      formId, submissionId, formData,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/submit/form/${formId}/${submissionId}/`,
        data: {
          submit_data: formData,
        },
      });
    },
    async paginate(fn, opts = {}) {
      let results = [];
      let more = true;
      let page = 0;

      while (more) {
        const response = await fn({
          ...opts,
          page,
        });
        results = results.concat(response);
        more = response.length === opts.pageSize; // Adjust based on API response format for pagination
        page += 1;
      }

      return results;
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
  version: "0.0.{{ts}}",
};
