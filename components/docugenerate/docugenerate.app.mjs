import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "docugenerate",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template",
      description: "The ID of the template",
      async options() {
        const response = await this.listTemplates();
        return response.map((template) => ({
          label: template.name,
          value: template.id,
        }));
      },
    },
  },
  methods: {
    getBaseUrl() {
      return "https://api.docugenerate.com/v1";
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        ...headers,
        "Authorization": `${this.$auth.api_key}`,
      };
    },
    makeRequest({
      $ = this,
      method = "GET",
      path,
      headers,
      ...args
    }) {
      const config = {
        method,
        url: `${this.getBaseUrl()}${path}`,
        headers: this.getHeaders(headers),
        ...args,
      };
      return axios($, config);
    },
    listTemplates($ = this) {
      return this.makeRequest({
        $,
        path: "/template",
      });
    },
    getTemplate($ = this, templateId) {
      return this.makeRequest({
        $,
        path: `/template/${templateId}`,
      });
    },
    deleteTemplate($ = this, templateId) {
      return this.makeRequest({
        $,
        method: "DELETE",
        path: `/template/${templateId}`,
      });
    },
    listDocuments($ = this, templateId) {
      return this.makeRequest({
        $,
        path: `/document?template_id=${templateId}`,
      });
    },
    getDocument($ = this, documentId) {
      return this.makeRequest({
        $,
        path: `/document/${documentId}`,
      });
    },
    updateDocument($ = this, documentId, body) {
      return this.makeRequest({
        $,
        method: "PUT",
        path: `/document/${documentId}`,
        data: body,
      });
    },
    deleteDocument($ = this, documentId) {
      return this.makeRequest({
        $,
        method: "DELETE",
        path: `/document/${documentId}`,
      });
    },
    generateDocument($ = this, body) {
      return this.makeRequest({
        $,
        method: "POST",
        path: "/document",
        data: body,
      });
    },
    createTemplate($ = this, body, headers) {
      return this.makeRequest({
        $,
        method: "POST",
        path: "/template",
        data: body,
        headers,
      });
    },
  },
};
