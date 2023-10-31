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
        return formats.map(({ id }) => id);
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
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "x-api-key": this.$auth.api_key,
        },
        ...args,
      });
    },
    getTemplates() {
      return this._makeRequest({
        path: "/templates",
      });
    },
    getTemplateDetails({ templateId }) {
      return this._makeRequest({
        path: `/templates/${templateId}`,
      });
    },
  },
};
