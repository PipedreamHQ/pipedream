import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "blocknative",
  propDefinitions: {
    confidenceLevels: {
      type: "integer[]",
      label: "confidenceLevels",
      description: "Confidence levels to include in the gas price estimation",
    },
    chainid: {
      type: "string",
      label: "chainid",
      description: "Blockchain network identifier to query gas prices for",
      async options() {
        const response = await this.getChains();
        return response.map(({
          label, chainId,
        }) => ({
          value: chainId,
          label: label,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.blocknative.com";
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
          "Authorization": `${this.$auth.api_key}`,
          ...headers,
        },
      });
    },

    async getBlockprices(args = {}) {
      return this._makeRequest({
        path: "/gasprices/blockprices",
        ...args,
      });
    },
    async getChains(args = {}) {
      return this._makeRequest({
        path: "/chains",
        ...args,
      });
    },
    async getOracles(args = {}) {
      return this._makeRequest({
        path: "/oracles",
        ...args,
      });
    },
  },
};
