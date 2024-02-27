import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "templated",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template used to render",
      async options() {
        const resources = await this.listTemplates();

        return resources.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.templated.io/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async listTemplates(args = {}) {
      return this._makeRequest({
        path: "/templates",
        ...args,
      });
    },
    async listTemplateLayers({
      id, ...args
    }) {
      return this._makeRequest({
        path: `/template/${id}/layers/`,
        ...args,
      });
    },
    // async createRender(args = {}) {
    //   return this._makeRequest({
    //     path: "/render",
    //     ...args,
    //   });
    // },
    async getTemplate({
      id, ...args
    }) {
      return this._makeRequest({
        path: `/template/${id}`,
        ...args,
      });
    },
  },
};
