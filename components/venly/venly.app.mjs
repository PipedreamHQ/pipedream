import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "venly",
  propDefinitions: {
    blockchainType: {
      type: "string",
      label: "Blockchain Type",
      description: "The type of blockchain.",
    },
    contractMetadata: {
      type: "object",
      label: "Contract Metadata",
      description: "The metadata for the contract.",
      optional: true,
    },
    nftMetadata: {
      type: "object",
      label: "NFT Metadata",
      description: "The metadata for the NFT.",
    },
    mintingRestrictions: {
      type: "object",
      label: "Minting Restrictions",
      description: "Restrictions for minting the NFT.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://nft-api-sandbox.venly.io/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, data, params, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
        params,
      });
    },
    async authKeys() {
      console.log(Object.keys(this.$auth));
    },
    async deployContract({
      blockchainType, contractMetadata,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/minter/contracts",
        data: {
          chain: blockchainType,
          ...contractMetadata,
        },
      });
    },
    async createTokenType({
      contractId,
      nftMetadata,
      mintingRestrictions,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/minter/contracts/${contractId}/token-types`,
        data: {
          ...nftMetadata,
          ...mintingRestrictions,
        },
      });
    },
  },
};
