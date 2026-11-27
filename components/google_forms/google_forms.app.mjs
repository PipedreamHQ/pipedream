import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "google_forms",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "Identifier of a Google Form",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the form which is visible to responders",
    },
    questionTitle: {
      type: "string",
      label: "Title",
      description: "The question text shown to responders, e.g. `Preferred meeting day`.",
    },
    questionDescription: {
      type: "string",
      label: "Description",
      description: "Helper text shown under the question, e.g. `Pick the day that suits you best`.",
    },
    questionIndex: {
      type: "integer",
      label: "Index",
      description: "0-based position of the question in the form, e.g. `0` for the top. Must be between 0 and the current number of items.",
    },
    formResponseId: {
      type: "string",
      label: "Form Response",
      description: "The response ID within the form",
      async options({ formId }) {
        const { responses } = await this.listFormResponses({
          formId,
        });
        return responses?.map(({ responseId }) => responseId) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://forms.googleapis.com/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    getForm({
      formId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/forms/${formId}`,
        ...args,
      });
    },
    createForm(args = {}) {
      return this._makeRequest({
        path: "/forms",
        method: "POST",
        ...args,
      });
    },
    updateForm({
      formId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/forms/${formId}:batchUpdate`,
        method: "POST",
        ...args,
      });
    },
    getFormResponse({
      formId, responseId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/forms/${formId}/responses/${responseId}`,
        ...args,
      });
    },
    listFormResponses({
      formId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/forms/${formId}/responses`,
        ...args,
      });
    },
  },
};
