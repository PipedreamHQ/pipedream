export default {
  type: "app",
  app: "orshot",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to render",
    },
    studioTemplateId: {
      type: "string",
      label: "Studio Template ID",
      description:
        "The ID of the studio template to render. You can find this on the template playground page.",
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
        {
          label: "PDF",
          value: "pdf",
        },
      ],
      default: "png",
    },
    modifications: {
      type: "object",
      label: "Template Modifications",
      description:
        "Key-value pairs for template modifications. The keys should match the modification keys available for your template.",
    },
  },
  methods: {
    _baseUrl() {
      return this.$auth.domain || "https://api.orshot.com";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this, path, ...otherOpts
      } = opts;
      return $.makeRequest({
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...otherOpts.headers,
          "Authorization": `Bearer ${this.$auth.token}`,
          "Content-Type": "application/json",
        },
      });
    },
    async listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/v1/templates",
        ...opts,
      });
    },
    async getTemplateModifications({
      templateId, ...opts
    }) {
      return this._makeRequest({
        path: `/v1/templates/modifications?templateId=${templateId}`,
        ...opts,
      });
    },
    async getStudioTemplateModifications({
      templateId, ...opts
    }) {
      return this._makeRequest({
        path: `/v1/studio/template/modifications?templateId=${templateId}`,
        ...opts,
      });
    },
    async generateImageFromLibraryTemplate({
      templateId,
      modifications = {},
      responseType = "base64",
      responseFormat = "png",
      ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/generate/images",
        data: {
          templateId,
          modifications,
          source: "pipedream-integration",
          response: {
            format: responseFormat,
            type: responseType,
          },
        },
        ...opts,
      });
    },
    async generateImageFromStudioTemplate({
      templateId,
      modifications = {},
      responseType = "base64",
      responseFormat = "png",
      ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/studio/render",
        data: {
          templateId,
          modifications,
          source: "pipedream-integration",
          response: {
            format: responseFormat,
            type: responseType,
          },
        },
        ...opts,
      });
    },
  },
};
