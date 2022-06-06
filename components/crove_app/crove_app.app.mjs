import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "crove_app",
  propDefinitions: {
    document_id: {
      type: "string",
      label: "Document ID",
      description: "Document ID of document.",
      async options() {
        var config = {
          url: `${this._getBaseUrl()}/documents/?limit=50`,
          method: "GET",
        };
        var resp = await this._makeRequest(config);
        resp = resp.results;
        return resp.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
    template_id: {
      type: "string",
      label: "Template",
      description: "Template ID of template.",
      async options() {
        var config = {
          url: `${this._getBaseUrl()}/templates/?limit=50`,
          method: "GET",
        };
        var resp = await this._makeRequest(config);
        resp = resp.results;
        return resp.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _getBaseUrl() {
      return "https://v2.api.crove.app/api/integrations/external";
    },
    async _makeRequest(options = {}, $ = this) {
      const config = {
        ...options,
        headers: {
          "X-API-KEY": `${this.$auth.api_key}`,
        },
      };
      return axios($, config).then( (resp) => {
        return resp;
      })
        .catch( (error) => {
          throw new Error(`Error! ${error.response.data.errors[0].message}`);
        });
    },
  },
};
