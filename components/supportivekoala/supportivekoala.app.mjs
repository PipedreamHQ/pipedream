import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "supportivekoala",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "Template that defines how the image will be created",
      async options() {
        const templates = await this.getTemplates();
        return templates.map((template) => ({
          label: template.name,
          value: template._id,
        }));
      },
    },
  },
  methods: {
    async _makeRequest({
      $ = this,
      opts,
    }) {
      const {
        method = "get",
        path,
        params,
        data,
      } = opts;
      return axios($, {
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
        url: `https://api.supportivekoala.com/v1${path}`,
        method,
        params,
        data,
      });
    },
    async getTemplates() {
      return this._makeRequest({
        opts: {
          path: "/templates",
        },
      });    },
    async getTemplate({
      $ = this,
      templateId,
    }) {
      return this._makeRequest({
        $,
        opts: {
          path: `/templates/${templateId}`,
        },
      });
    },
    async createImage({
      $,
      templateId,
      params,
    }) {
      return this._makeRequest({
        $,
        opts: {
          path: "/images",
          method: "post",
          data: {
            template: templateId,
            params,
          },
        },
      });
    },
  },
};
