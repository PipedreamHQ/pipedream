import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "docugenerate",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template you want to use",
      async options() {
        const response = await this.listTemplates();
        return response.data.map(template => ({
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
        path: "/templates",
      });
    },
  },
};