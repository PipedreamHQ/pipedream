import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "boloforms",
  propDefinitions: {
    formId: {
      type: "string[]",
      label: "Form ID",
      description: "The ID of the form.",
      async options({ page }) {
        const { forms } = await this.getForms({
          params: {
            page: page + 1,
            filter: "ALL",
          },
        });
        return forms.map(({
          formId: value, formJson: { title: label },
        }) => ({
          label,
          value,
        }));
      },
    },
    documentId: {
      type: "string[]",
      label: "Document ID",
      description: "The ID of the document.",
      async options({
        page, isStandAloneTemplate = false,
      }) {
        const { documents } = await this.getDocuments({
          params: {
            page: page + 1,
            filter: "ALL",
            isStandAloneTemplate,
          },
        });
        return documents.map(({
          documentId: value, documentName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject will be sent.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message will be sent.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://signature-backend.boloforms.com/api/v1/signature";
    },
    _headers() {
      return {
        "x-api-key": this.$auth.api_key,
        "Workspaceid": this.$auth.workspace_id,
        "Content-Type": "application/json",
      };
    },
    _data(data) {
      return {
        email: this.$auth.email,
        ...data,
      };
    },
    _makeRequest({
      $ = this, data, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        data: this._data(data),
        ...opts,
      });
    },
    dispatchPDFTemplate(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/add-respondent-pdfTemplate",
        ...opts,
      });
    },
    dispatchForm(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/forms/send-form-email",
        ...opts,
      });
    },
    getDocuments(opts = {}) {
      return this._makeRequest({
        path: "/get-all-documents/v1",
        ...opts,
      });
    },
    getForms(opts = {}) {
      return this._makeRequest({
        path: "/get-all-forms/v1",
        ...opts,
      });
    },
    updateHooks(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/workspace/webhooks",
        ...opts,
      });
    },
  },
};
