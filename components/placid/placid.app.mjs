import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "placid",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template",
      async options() {
        const templates = await this.getTemplates();
        return templates.data.map((template) => ({
          value: template.uuid,
          label: template.title,
        }));
      },
    },
    layers: {
      type: "object",
      label: "Layers",
      description: "The layers of the template. For ech key representing a layer name, the value should be a JSON object representing the layer's properties. Eg. for the key `text`, the value can be `{ \"text\": \"Hello World\" }`. [See the documentation](https://placid.app/docs/2.0/rest/layers)",
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const config = {
        url: this.getUrl(path),
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_token}`,
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
    post(args = {}) {
      return this._makeRequest({
        method: "post",
        ...args,
      });
    },
  },
};
