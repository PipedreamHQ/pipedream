import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dynapictures",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "Select the template to use for generating the image",
      async options() {
        const templates = await this.listTemplates();
        return templates.map((template) => ({
          label: template.name,
          value: template.id,
        }));
      },
    },
    imageParams: {
      type: "string[]",
      label: "Image Parameters",
      description: "Custom parameters for the image layers as a JSON document",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.dynapictures.com";
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
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
      });
    },
    async listTemplates() {
      return this._makeRequest({
        path: "/templates",
      });
    },
    async generateImage({
      templateId, imageParams,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/designs/${templateId}`,
        data: {
          ...JSON.parse(imageParams),
        },
      });
    },
    // This method is not required by the instructions or the prompt
    // and is therefore omitted in the final code.
    // async deleteGeneratedImage({ imagePath }) {
    //   return this._makeRequest({
    //     method: "DELETE",
    //     path: `/images/${imagePath}`,
    //   });
    // },
    // These webhook methods are not required by the instructions or the prompt
    // and are therefore omitted in the final code.
    // async subscribeWebhook({ targetUrl, eventType, templateId }) {
    //   return this._makeRequest({
    //     method: "POST",
    //     path: `/hooks`,
    //     data: {
    //       targetUrl,
    //       eventType,
    //       templateId,
    //     },
    //   });
    // },
    // async unsubscribeWebhook({ targetUrl, eventType, templateId }) {
    //   return this._makeRequest({
    //     method: "DELETE",
    //     path: `/hooks`,
    //     data: {
    //       targetUrl,
    //       eventType,
    //       templateId,
    //     },
    //   });
    // },
  },
};
