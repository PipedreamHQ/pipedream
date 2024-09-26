import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

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
  },
  methods: {
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const config = {
        ...args,
        url: constants.BASE_URL + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
      };
      return axios($, config);
    },
    post(args = {}) {
      return this._makeRequest({
        method: "post",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "delete",
        ...args,
      });
    },
    listTemplates() {
      return this._makeRequest({
        path: "/templates",
      });
    },
  },
};
