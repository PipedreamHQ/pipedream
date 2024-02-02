import { axios } from "@pipedream/platform";
import { STORAGE_TYPE_OPTIONS } from "./common/constants.mjs";

export default {
  type: "app",
  app: "venly",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contract/collection",
    },
    symbol: {
      type: "string",
      label: "Symbol",
      description: "The symbol for the contract such as VENS",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the contract/collection",
    },
    image: {
      type: "string",
      label: "Image URL",
      description: "The URL of the image that will be displayed for your collection",
    },
    externalUrl: {
      type: "string",
      label: "External URL",
      description: "You can add an external URL to your collection. This can be anything such as a link to your website",
    },
    media: {
      type: "object",
      label: "Media",
      description: "This is the media object where you can add an optional key-value pair",
      optional: true,
    },
    owner: {
      type: "string",
      label: "Owner",
      description: "The wallet address which will have admin access to the contract. The owner can call the admin right functions on the contract. If not specified, the contract will be managed by Venly.",
      optional: true,
    },
    autoApprovedAddressesLocked: {
      type: "boolean",
      label: "Auto Approved Addresses Locked",
      optional: true,
    },
    storageType: {
      type: "string",
      label: "Storage Type",
      options: STORAGE_TYPE_OPTIONS,
      description: "This object holds the storage details for the metadata of the contract",
      optional: true,
    },
    storageLocation: {
      type: "string",
      label: "Storage Location",
      description: "Location of the NFT metadata. This property is mandatory only if `Storage Type` is set to *custom*",
      optional: true,
    },
    chain: {
      type: "string",
      label: "Blockchain",
      description: "The blockchain on which your contract/collection will be created",
      optional: true,
      async options() {
        return this.listChains();
      },
    },
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
    async _makeRequest({
      $ = this, headers, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: `${this.$auth.service_environment}/api`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listChains() {
      const response = await this._makeRequest({
        url: "/env",
      });
      return response.supportedChainsForItemCreation;
    },
    async deployContract(args) {
      return this._makeRequest({
        method: "POST",
        path: "/minter/contracts",
        ...args,
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
