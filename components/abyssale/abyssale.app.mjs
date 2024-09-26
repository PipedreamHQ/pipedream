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
    templateFormatName: {
      type: "string",
      label: "Template Format Name",
      description: "The name of the template format",
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
      description: "A dictionary containing all elements with properties you would like to override form the default template. Keys correspond to element names in the layer eg. `bg_image` and `title`. Values correspond to the properties you would like to override eg. For `title` key the value could be `{ \"payload\": \"Hello World\" }`. [See the documentation](https://developers.abyssale.com/rest-api/generation/element-properties)",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.abyssale.com";
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const config = {
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "x-api-key": this.$auth.api_key,
        },
        ...args,
      };
      return axios($, config);
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
    post(args = {}) {
      return this._makeRequest({
        method: "post",
        ...args,
      });
    },
  },
};
