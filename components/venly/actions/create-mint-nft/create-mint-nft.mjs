import venly from "../../venly.app.mjs";
import { parseJsonString } from "../../common/utils.mjs";

export default {
  key: "venly-create-mint-nft",
  name: "Create and Mint NFT",
  description: "Creates a template or token type that allows for minting of new NFTs. [See the documentation](https://docs.venly.io/reference/definetokentype_1_1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    venly,
    contractId: {
      propDefinition: [
        venly,
        "contractId",
      ],
    },
    fungible: {
      propDefinition: [
        venly,
        "fungible",
      ],
    },
    burnable: {
      propDefinition: [
        venly,
        "burnable",
      ],
    },
    name: {
      propDefinition: [
        venly,
        "name",
      ],
      description: "Name of the NFTs that will be created from this template",
    },
    description: {
      propDefinition: [
        venly,
        "description",
      ],
      description: "Description of the NFTs that will be created from this template",
      optional: true,
    },
    image: {
      propDefinition: [
        venly,
        "image",
      ],
      label: "Image",
      description: "Image of the NFTs that will be created from this template",
      optional: true,
    },
    externalUrl: {
      propDefinition: [
        venly,
        "externalUrl",
      ],
      description: "External URL of the NFTs that will be created from this template",
      optional: true,
    },
    backgroundColor: {
      propDefinition: [
        venly,
        "backgroundColor",
      ],
    },
    animationUrls: {
      propDefinition: [
        venly,
        "animationUrls",
      ],
    },
    maxSupply: {
      propDefinition: [
        venly,
        "maxSupply",
      ],
    },
    attributes: {
      propDefinition: [
        venly,
        "attributes",
      ],
    },
    destinations: {
      propDefinition: [
        venly,
        "destinations",
      ],
    },
    storageType: {
      propDefinition: [
        venly,
        "storageType",
      ],
    },
    storageLocation: {
      propDefinition: [
        venly,
        "storageLocation",
      ],
    },
  },
  async run({ $ }) {
    const { // eslint-disable-next-line max-len
      venly, contractId, animationUrls, attributes, destinations, storageType, storageLocation, ...otherData
    } = this;

    const data = {
      ...otherData,
      ...(storageType && {
        storage: {
          type: storageType,
          ...(storageLocation && {
            location: storageLocation,
          }),
        },
      }),
      animationUrls: animationUrls?.map?.(parseJsonString),
      attributes: attributes?.map?.(parseJsonString),
      destinations: destinations?.map?.(parseJsonString),
    };

    const response = await venly.createTokenType({
      $,
      contractId,
      data,
    });

    $.export("$summary", `Successfully created token type (id: ${response.id})`);

    return response;
  },
};
