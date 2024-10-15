import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "imagior",
  propDefinitions: {
    template_id: {
      type: "string",
      label: "Template ID",
      description: "The unique ID of the design template you created",
      required: true,
    },
    image_parameters: {
      type: "object",
      label: "Image Parameters",
      description: "Optional parameters to customize the appearance of the image",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.imagior.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createTemplate(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/templates",
        ...opts,
      });
    },
    async generateImage({
      template_id, image_parameters,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/image/generate",
        data: {
          templateId: template_id,
          elements: image_parameters,
        },
      });
    },
  },
};
