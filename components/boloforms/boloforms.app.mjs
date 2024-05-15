import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "boloforms",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form.",
      async options() {
        // Example implementation - replace with actual API call to fetch forms
        const forms = await this.getForms();
        return forms.map((form) => ({
          label: form.name,
          value: form.id,
        }));
      },
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template.",
      async options() {
        // Example implementation - replace with actual API call to fetch templates
        const templates = await this.getTemplates();
        return templates.map((template) => ({
          label: template.name,
          value: template.id,
        }));
      },
    },
    documentId: {
      type: "string",
      label: "Document ID",
      description: "The ID of the document.",
      async options() {
        // Example implementation - replace with actual API call to fetch documents
        const documents = await this.getDocuments();
        return documents.map((document) => ({
          label: document.name,
          value: document.id,
        }));
      },
    },
    recipientEmail: {
      type: "string",
      label: "Recipient's Email",
      description: "The email of the recipient.",
    },
    customMessage: {
      type: "string",
      label: "Custom Message",
      description: "A custom message to include in the dispatch.",
      optional: true,
    },
    signerEmail: {
      type: "string",
      label: "Signer's Email",
      description: "The email of the signer.",
    },
    variables: {
      type: "string[]",
      label: "Variables",
      description: "Variables to insert into the template.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://sapi.boloforms.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "x-api-key": this.$auth.api_key,
          "Content-Type": "application/json",
        },
      });
    },
    async getForms() {
      // Placeholder for actual API call to fetch forms
      return this._makeRequest({
        path: "/forms",
      });
    },
    async getTemplates() {
      // Placeholder for actual API call to fetch templates
      return this._makeRequest({
        path: "/templates",
      });
    },
    async getDocuments() {
      // Placeholder for actual API call to fetch documents
      return this._makeRequest({
        path: "/documents",
      });
    },
    async dispatchForm({
      formId, recipientEmail, customMessage,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/signature/form-template",
        data: {
          formId,
          recipientEmail,
          customMessage,
        },
      });
    },
    async dispatchTemplate({
      templateId, signerEmail, variables,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/signature/pdf-template",
        data: {
          templateId,
          signerEmail,
          variables,
        },
      });
    },
  },
};
