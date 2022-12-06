import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "supportivekoala",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "Template that defines how the image will be created",
      async options() {
        const templates = await this.getTemplates();
        return templates.map((template) => ({
          label: template.name,
          value: template._id,
        }));
      },
    },
  },
  methods: {
    async _makeRequest({
      $ = this, path, method = "get", ...args
    } = {}) {
      return axios($, {
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
        url: `https://api.supportivekoala.com/v1${path}`,
        method,
        ...args,
      });
    },
    async getTemplates(args = {}) {
      return this._makeRequest({
        path: "/templates",
        ...args,
      });
    },
    async getTemplate({
      templateId, ...args
    }) {
      return this._makeRequest({
        path: `/templates/${templateId}`,
        ...args,
      });
    },
    async createImage(args = {}) {
      return this._makeRequest({
        path: "/images",
        method: "post",
        ...args,
      });
    },
  },
};
