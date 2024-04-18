import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "videoask",
  propDefinitions: {
    formName: {
      type: "string",
      label: "Form Name",
      description: "Name for the new form",
    },
    formSettings: {
      type: "object",
      label: "Form Settings",
      description: "Optional settings for the form creation such as public or private status, form design, etc",
      optional: true,
    },
    formId: {
      type: "string",
      label: "Form ID",
      description: "ID of the form where the question will be created",
    },
    questionContent: {
      type: "string",
      label: "Question Content",
      description: "Content of the question to be created",
    },
    questionConfig: {
      type: "object",
      label: "Question Configuration",
      description: "Optional configurations for the question including type, options for multiple choice, layout, etc",
      optional: true,
    },
    contactInfo: {
      type: "object",
      label: "Contact Information",
      description: "Contact information including name, email, phone number, etc",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.videoask.com";
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
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createForm({
      formName, formSettings,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/forms",
        data: {
          name: formName,
          settings: formSettings,
        },
      });
    },
    async createQuestion({
      formId, questionContent, questionConfig,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/forms/${formId}/questions`,
        data: {
          content: questionContent,
          config: questionConfig,
        },
      });
    },
    async createContact(contactInfo) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        data: contactInfo,
      });
    },
  },
};
