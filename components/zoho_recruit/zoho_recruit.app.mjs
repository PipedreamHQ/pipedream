import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zoho_recruit",
  propDefinitions: {
    module: {
      type: "string",
      label: "Module",
      description: "The API name of the module",
      async options() {
        const { modules } = await this.listModules();
        return modules.map(({ api_name: name }) => name);
      },
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "The API names of the fields to include",
      async options({ module }) {
        const { fields } = await this.listFields({
          params: {
            module,
          },
        });
        return fields.map(({ api_name: name }) => name);
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://recruit.${this.zoho_recruit.$auth.base_api_uri}/recruit/v2";
    },
    _headers() {
      return {
        "Authorization": `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listModules(args = {}) {
      return this._makeRequest({
        path: "/settings/modules",
        ...args,
      });
    },
    listFields(args = {}) {
      return this._makeRequest({
        path: "/settings/fields",
        ...args,
      });
    },
    createRecord({
      moduleName, ...args
    }) {
      return this._makeRequest({
        path: `/${moduleName}`,
        method: "POST",
        ...args,
      });
    },
  },
};
