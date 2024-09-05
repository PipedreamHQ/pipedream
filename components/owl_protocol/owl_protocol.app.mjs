import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "owl_protocol",
  propDefinitions: {
    chainId: {
      type: "integer",
      label: "Chain ID",
      description: "Network Chain ID",
      async options() {
        const networksIds = await this.listNetworks();
        return networksIds.map(({
          chainId, name,
        }) => ({
          value: chainId,
          label: name,
        }));
      },
    },
    collectionName: {
      type: "string",
      label: "Collection Name",
      description: "Name of the collection",
    },
    symbol: {
      type: "string",
      label: "Collection Symbol",
      description: "Ticker symbol of collection, Must be 3-4 characters long",
    },
    description: {
      type: "string",
      label: "Collection Description",
      description: "Description of the collection",
    },
    address: {
      type: "string",
      label: "Address",
      description: "An ethereum address",
    },
    mintTo: {
      type: "string",
      label: "Mint To",
      description: "Email, userId or address to mint to",
    },
  },
  methods: {
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this.$auth.api_url + path,
        headers: {
          ...headers,
          "accept": "application/json",
          "x-api-key": `${this.$auth.api_key}`,
        },
      });
    },
    async getNetwork({
      chainId, ...args
    }) {
      return this._makeRequest({
        path: `/network/${chainId}`,
        ...args,
      });
    },
    async mintAsset({
      chainId, address, ...args
    }) {
      return this._makeRequest({
        method: "post",
        path: `/project/collection/${chainId}/${address}/mint/erc721AutoId`,
        ...args,
      });
    },
    async deployCollection(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/project/collection/deploy",
        ...args,
      });
    },
    async listNetworks(args = {}) {
      return this._makeRequest({
        path: "/networks",
        ...args,
      });
    },
  },
};
