import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bannerbear",
  propDefinitions: {
    template: {
      type: "string",
      label: "Template",
      description: "BannerBear template. [See the docs](https://developers.bannerbear.com/#get-v2-templates)",
      async options({ prevContext }) {
        const currentPage = prevContext.nextPage || 1;
        const templates = await this.fetchTemplates(this, {
          page: currentPage,
        });
        const options = this._extractTemplateOptions(templates);

        return this._buildPaginatedOptions(options, currentPage);
      },
    },
  },
  methods: {
    async fetchTemplates(ctx = this, params = {}) {
      const response = await axios(ctx, this._getRequestParams({
        method: "GET",
        url: "https://api.bannerbear.com/v2/templates",
        ...params,
      }));

      return response;
    },
    async createImage(ctx = this, template, modifications, params = {}) {
      const response = await axios(ctx, this._getRequestParams({
        method: "POST",
        url: "https://sync.api.bannerbear.com/v2/images",
        data: {
          template,
          modifications,
        },
        ...params,
      }));

      return response;
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    _getRequestParams(opts = {}) {
      return {
        ...opts,
        headers: this._getHeaders(),
      };
    },
    _buildPaginatedOptions(options, currentPage) {
      return {
        options,
        context: {
          nextPage: currentPage + 1,
        },
      };
    },
    _extractTemplateOptions(templates) {
      const options = templates.map((template) => {
        const {
          name,
          uid,
        } = template;

        return {
          label: name || "Untitled",
          value: uid,
        };
      });

      return options;
    },
  },
};
