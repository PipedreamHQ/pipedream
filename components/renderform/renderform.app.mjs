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
      async options({ page }) {
        const resources = await this.listTemplates({
          limit: 100,
          offset: page * 100,
        });

        return resources.map(({
          identifier, name,
        }) => ({
          value: identifier,
          label: name,
        }));
      },
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
      return "https://get.renderform.io/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-API-KEY": this.$auth.api_key,
        },
      });
    },
    async captureImage(opts = {}) {
      const {
        url, width, height,
      } = opts;

      return this._makeRequest({
        method: "POST",
        path: "/v1/screenshots",
        data: {
          url,
          width,
          height,
        },
      });
    },
    async listTemplates(opts = {}) {
      const {
        filterName, offset, limit,
      } = opts;
      const queryParams = filterName
        ? {
          name: filterName,
        }
        : {};

      if (offset) queryParams.offset = offset;
      if (limit) queryParams.limit = limit;

      return this._makeRequest({
        path: "/v1/my-templates",
        params: queryParams,
      });
    },
    async generateImage(opts = {}) {
      const {
        template, templateVariables,
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: "/v1/render",
        data: {
          template,
          ...templateVariables,
        },
      });
    },
    async getRenderResults(args = {}) {
      return this._makeRequest({
        path: "/v2/results",
        ...args,
      });
    },
  },
};
