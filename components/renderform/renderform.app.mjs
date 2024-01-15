import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "renderform",
  propDefinitions: {
    renderId: {
      type: "string",
      label: "Render ID",
      description: "Unique identifier for each render",
    },
    screenCoordinates: {
      type: "object",
      label: "Screen Coordinates",
      description: "The coordinates on the screen to capture an image",
    },
    imageFormat: {
      type: "string",
      label: "Image Format",
      description: "The format of the captured image",
      options: [
        "png",
        "jpg",
        "webp",
      ],
      optional: true,
    },
    imageQuality: {
      type: "integer",
      label: "Image Quality",
      description: "The quality of the captured image",
      min: 1,
      max: 100,
      optional: true,
    },
    filterName: {
      type: "string",
      label: "Filter Name",
      description: "Filter templates by name",
      optional: true,
    },
    template: {
      type: "string",
      label: "Template",
      description: "The name or identifier of the template to use for image generation",
    },
    templateVariables: {
      type: "object",
      label: "Template Variables",
      description: "Variables used within the template",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.renderform.io";
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
          "X-API-KEY": this.$auth.api_key,
        },
      });
    },
    async captureImage(opts = {}) {
      const {
        screenCoordinates, imageFormat, imageQuality,
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: "/v1/take-screenshot",
        data: {
          screenCoordinates,
          imageFormat,
          imageQuality,
        },
      });
    },
    async listTemplates(opts = {}) {
      const { filterName } = opts;
      const queryParams = filterName
        ? {
          name: filterName,
        }
        : {};
      return this._makeRequest({
        path: "/v1/templates",
        params: queryParams,
      });
    },
    async generateImage(opts = {}) {
      const {
        template, templateVariables,
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: "/v1/render-image",
        data: {
          template,
          ...templateVariables,
        },
      });
    },
    async getRenderResult(opts = {}) {
      const { renderId } = opts;
      return this._makeRequest({
        path: `/v1/render-result/${renderId}`,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
  version: "0.0.{{ts}}",
};
