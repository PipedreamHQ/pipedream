import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bigdatacorp",
  propDefinitions: {
    doc: {
      type: "string",
      label: "Document Number",
      description: "Document Number of the entity you want to search for",
    },
    dataset: {
      type: "string",
      label: "Dataset",
      description: "The target dataset to which the query will be sent",
    },
  },
  methods: {
    _baseUrl() {
      return "https://plataforma.bigdatacorp.com.br";
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
          "Accept": "application/json",
          "AccessToken": `${this.$auth.access_token}`,
          "TokenId": `${this.$auth.token_id}`,
        },
      });
    },
    async getPersonData(args = {}) {
      return this._makeRequest({
        path: "/pessoas",
        method: "post",
        ...args,
      });
    },
    async getCompanyData(args = {}) {
      return this._makeRequest({
        path: "/empresas",
        method: "post",
        ...args,
      });
    },
    async getAddressData(args = {}) {
      return this._makeRequest({
        path: "/enderecos",
        method: "post",
        ...args,
      });
    },
  },
};
