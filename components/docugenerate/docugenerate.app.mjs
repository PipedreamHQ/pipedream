import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "docugenerate",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template",
      description: "The selected template",
      async options() {
        const response = await this.listTemplates();
        return response.map(template => ({
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
    getHeaders() {
      return {
        "Authorization": `${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    async makeRequest({
      $ = this,
      method = "GET",
      path,
      ...args
    }) {
      const config = {
        method,
        url: `${this.getBaseUrl()}${path}`,
        headers: this.getHeaders(),
        ...args,
      };
      return axios($, config);
    },
    async listTemplates($ = this) {
      return this.makeRequest({
        $,
        path: "/template",
      });
    },
    async getTemplate($ = this, templateId) {
      return this.makeRequest({
        $,
        path: `/template/${templateId}`,
      });
    },
    async deleteTemplate($ = this, templateId) {
      return this.makeRequest({
        $,
        method: "DELETE",
        path: `/template/${templateId}`,
      });
    },
    async listDocuments($ = this, templateId) {
      return this.makeRequest({
        $,
        path: `/document?template_id=${templateId}`,
      });
    },
  },
};