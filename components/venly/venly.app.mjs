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
      description: "This object holds the storage details for the metadata of the item being created",
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
      async options() {
        return this.listChains();
      },
    },
    contractId: {
      type: "integer",
      label: "Contract ID",
      description: "Select a Contract or provide a custom Contract ID.",
      async options() {
        const response = await this.listContracts();
        return response?.map?.(({
          name, id,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    fungible: {
      type: "boolean",
      label: "Fungible",
      description: "Determines if the NFTs from this template will be minted as fungible/non fungible. Defaults to false.",
      optional: true,
      default: false,
    },
    burnable: {
      type: "boolean",
      label: "Burnable",
      description: "Determines if the NFTs from this template will be burnable. Defaults to false.",
      optional: true,
      default: false,
    },
    backgroundColor: {
      type: "object",
      label: "Background Color",
      description: "Background color of the NFTs that will be created from this template",
      optional: true,
    },
    maxSupply: {
      type: "integer",
      label: "Max Supply",
      description: "Max Supply for NFTs created by this template",
      optional: true,
    },
    animationUrls: {
      type: "string[]",
      label: "Animation URLs",
      description: "Each item should be a JSON string or object. Example: `{ \"type\": \"type of the animation media\", \"value\": \"URL of the animation media\" }`",
      optional: true,
    },
    attributes: {
      type: "string[]",
      label: "Attributes",
      description: "Each item should be a JSON string or object. Example: `{ \"type\": \"property|stat|boost|system\", \"name\": \"Name of the attribute\", \"value\": \"Value of the attribute\", \"maxValue\": \"Max value of the attribute\" }`",
      optional: true,
    },
    destinations: {
      type: "string[]",
      label: "Destinations",
      description: "Each item should be a JSON string or object. Example: `{ \"address\": \"Address of the destination wallet where minted tokens will be sent\", \"amount\": \"[int] Amount of tokens to be minted and sent to specified wallet address\" }`",
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
    async listContracts() {
      return this._makeRequest({
        url: "/minter/contracts",
      });
    },
    async deployContract(args) {
      return this._makeRequest({
        method: "POST",
        url: "/minter/contracts",
        ...args,
      });
    },
    async createTokenType({
      contractId,
      ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/minter/contracts/${contractId}/token-types`,
        ...args,
      });
    },
  },
};
