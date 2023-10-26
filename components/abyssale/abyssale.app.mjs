import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "abyssale",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template",
      async options() {
        const templates = await this.getTemplates();
        return templates.map((t) => ({
          value: t.id,
          label: t.name,
        }));
      },
    },
    formatName: {
      type: "string",
      label: "Format Name",
      description: "The name of the format",
      async options({ templateId }) {
        const { formats } = await this.getTemplateDetails({
          templateId,
        });
        return formats.map((f) => ({
          value: f.id,
          label: f.id,
        }));
      },
    },
    elements: {
      type: "object",
      label: "Elements",
      description: "A dictionary containing all elements with properties you would like to override form the default template (keys correspond to layer names)",
    },
    imageFileType: {
      type: "string",
      label: "Image File Type",
      description: "The type of the image file",
      options: [
        "jpeg",
        "png",
        "gif",
      ],
    },
    callbackUrl: {
      type: "string",
      label: "Callback URL",
      description: "The URL that will be called once the generation of your export is done",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.abyssale.com";
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
          "x-api-key": this.$auth.api_key,
        },
      });
    },
    async getTemplates() {
      return this._makeRequest({
        path: "/templates",
      });
    },
    async getTemplateDetails({ templateId }) {
      return this._makeRequest({
        path: `/templates/${templateId}`,
      });
    },
    async generateSingleImage({
      templateId, elements, imageFileType,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/banner-builder/${templateId}/generate`,
        data: {
          elements,
          image_file_type: imageFileType,
        },
      });
    },
    async generateAnimatedGif({
      templateId,
      callbackUrl,
      elements,
      imageFileType,
      templateFormatNames,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/async/banner-builder/${templateId}/generate`,
        data: {
          callback_url: callbackUrl,
          image_file_type: imageFileType,
          gif: {
            max_fps: 9,
            repeat: -1,
          },
          template_format_names: templateFormatNames,
          elements,
        },
      });
    },
    async generateImageFromUrl({
      templateId,
      elements,
      imageFileType,
      formatName,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/img.abyssale.com/${templateId}/${formatName}`,
        data: {
          elements,
          image_file_type: imageFileType,
        },
      });
    },
  },
};
