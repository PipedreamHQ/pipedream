import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "templated",
  propDefinitions: {
    apiKey: {
      type: "string",
      label: "API Key",
      description: "Your Templated API Key",
      secret: true,
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The unique identifier for the template",
      async options({ page = 0 }) {
        const templates = await this.listTemplates({
          page,
        });
        return templates.map((template) => ({
          label: template.name,
          value: template.id,
        }));
      },
    },
    renderId: {
      type: "string",
      label: "Render ID",
      description: "The unique identifier for the render",
      async options({ templateId }) {
        const renders = await this.listRenders({
          templateId,
        });
        return renders.map((render) => ({
          label: render.id,
          value: render.id,
        }));
      },
    },
    layerChanges: {
      type: "string",
      label: "Layer Changes",
      description: "JSON string of the layer changes to apply to the template",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.templated.io";
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
          "Authorization": `Bearer ${this.apiKey}`,
        },
      });
    },
    async listTemplates({ page }) {
      return this._makeRequest({
        path: "/v1/templates",
        params: {
          page,
        },
      });
    },
    async listTemplateLayers({ templateId }) {
      return this._makeRequest({
        path: `/v1/templates/${templateId}/layers`,
      });
    },
    async createRender({
      templateId, layerChanges,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/render",
        data: {
          templateId,
          layerChanges: JSON.parse(layerChanges),
        },
      });
    },
    async retrieveRender({ renderId }) {
      return this._makeRequest({
        path: `/v1/render/${renderId}`,
      });
    },
    async listRenders({ templateId }) {
      return this._makeRequest({
        path: "/v1/renders",
        params: {
          templateId,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
  version: "0.0.{{ts}}",
};
