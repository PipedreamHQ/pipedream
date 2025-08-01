import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pdfless",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The unique identifier of the template.",
      async options({ page }) {
        const templates = await this.listTemplates({
          params: {
            page: page + 1,
          },
        });
        return templates.map((template) => ({
          label: template.name,
          value: template.id,
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.pdfless.com/v1${path}`;
    },
    getHeaders() {
      return {
        "apikey": this.$auth.api_key,
        "Content-Type": "application/json",
      };
    },
    makeRequest({
      $ = this, path, ...args
    } = {}) {
      return axios($, {
        url: this.getUrl(path),
        headers: this.getHeaders(),
        ...args,
      });
    },
    post(args = {}) {
      return this.makeRequest({
        method: "POST",
        ...args,
      });
    },
    listTemplates(args = {}) {
      return this.makeRequest({
        path: "/document-templates",
        ...args,
      });
    },
    generate(args = {}) {
      return this.post({
        path: "/pdfs",
        ...args,
      });
    },
  },
};
