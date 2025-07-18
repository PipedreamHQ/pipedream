import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "orshot",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to render",
      async options() {
        const templates = await this.listTemplates();
        return templates.map((template) => ({
          label: template.title,
          value: template.id,
        }));
      },
    },
    studioTemplateId: {
      type: "string",
      label: "Studio Template ID",
      description: "The ID of the studio template to render. You can find this on the template playground page.",
    },
    responseType: {
      type: "string",
      label: "Response Type",
      description: "Type of response to return",
      options: [
        {
          label: "Base64",
          value: "base64",
        },
        {
          label: "Binary",
          value: "binary",
        },
        {
          label: "URL",
          value: "url",
        },
      ],
      default: "base64",
    },
    responseFormat: {
      type: "string",
      label: "Response Format",
      description: "Format of the rendered image",
      options: [
        {
          label: "PNG",
          value: "png",
        },
        {
          label: "JPG",
          value: "jpg",
        },
        {
          label: "JPEG",
          value: "jpeg",
        },
        {
          label: "WebP",
          value: "webp",
        },
      ],
      default: "png",
    },
    modifications: {
      type: "object",
      label: "Template Modifications",
      description: "Key-value pairs for template modifications. The keys should match the modification keys available for your template.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.orshot.com/v1";
    },
    _makeRequest({
      $ = this, path, headers, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.token}`,
          "Content-Type": "application/json",
        },
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/templates",
        ...opts,
      });
    },
    getTemplateModifications(opts = {}) {
      return this._makeRequest({
        path: "/templates/modifications",
        ...opts,
      });
    },
    getStudioTemplateModifications(opts = {}) {
      return this._makeRequest({
        path: "/studio/template/modifications",
        ...opts,
      });
    },
    generateImageFromLibraryTemplate(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/generate/images",
        ...opts,
      });
    },
    generateImageFromStudioTemplate(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/studio/render",
        ...opts,
      });
    },
  },
};
