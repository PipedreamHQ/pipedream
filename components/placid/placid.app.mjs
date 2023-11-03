import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "placid",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template",
      async options() {
        const templates = await this.getTemplates();
        return templates.map((template) => ({
          value: template.uuid,
          label: template.title,
        }));
      },
    },
    layers: {
      type: "object",
      label: "Layers",
      description: "The layers of the template",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.placid.app/api/rest";
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
          "Authorization": `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async getTemplates() {
      return this._makeRequest({
        path: "/templates",
      });
    },
    async createImage({
      templateId, layers,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/images",
        data: {
          template_uuid: templateId,
          layers,
        },
      });
    },
    async createPdf({
      templateId, layers,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/pdfs",
        data: {
          template_uuid: templateId,
          layers,
        },
      });
    },
  },
};
