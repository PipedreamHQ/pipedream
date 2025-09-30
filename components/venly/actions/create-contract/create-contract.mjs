import venly from "../../venly.app.mjs";

export default {
  key: "venly-create-contract",
  name: "Create Contract",
  description:
    "Deploys a new NFT contract, or collection, on a specific blockchain. [See the documentation](https://docs.venly.io/reference/deploycontract)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    venly,
    name: {
      propDefinition: [
        venly,
        "name",
      ],
    },
    symbol: {
      propDefinition: [
        venly,
        "symbol",
      ],
    },
    description: {
      propDefinition: [
        venly,
        "description",
      ],
    },
    image: {
      propDefinition: [
        venly,
        "image",
      ],
    },
    externalUrl: {
      propDefinition: [
        venly,
        "externalUrl",
      ],
    },
    media: {
      propDefinition: [
        venly,
        "media",
      ],
    },
    owner: {
      propDefinition: [
        venly,
        "owner",
      ],
    },
    autoApprovedAddressesLocked: {
      propDefinition: [
        venly,
        "autoApprovedAddressesLocked",
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
    chain: {
      propDefinition: [
        venly,
        "chain",
      ],
    },
  },
  async run({ $ }) {
    const {
      venly, storageType, storageLocation, ...data
    } = this;
    const response = await venly.deployContract({
      $,
      data: {
        ...data,
        ...(storageType && {
          storage: {
            type: storageType,
            ...(storageLocation && {
              location: storageLocation,
            }),
          },
        }),
      },
    });

    $.export(
      "$summary",
      "Successfully deployed contract",
    );
    return response;
  },
};
