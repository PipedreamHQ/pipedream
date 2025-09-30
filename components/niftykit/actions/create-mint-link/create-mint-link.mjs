import niftykit from "../../niftykit.app.mjs";

export default {
  key: "niftykit-create-mint-link",
  name: "Create Mint Link",
  description: "Creates a mint link in NiftyKit. [See the documentation](https://api.niftykit.com/docs?_gl=1*d8mlfi*_ga*MTY5MTM2MjIwNi4xNjk0MDMzOTk3*_ga_B0DCGWCR37*MTY5NzE0MTUzNy40LjAuMTY5NzE0MTUzNy42MC4wLjA.#/onboarding/OnboardingController_createMintLink)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    niftykit,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the new mint link",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the new mint link",
    },
    image: {
      type: "string",
      label: "Image",
      description: "URL of the new mint link image",
    },
    maxAmount: {
      type: "string",
      label: "Max Amount",
      description: "Max amount",
    },
    maxPerWallet: {
      type: "string",
      label: "Max Per Wallet",
      description: "Max per wallet",
    },
    maxPerTx: {
      type: "string",
      label: "Max Per Tx",
      description: "Max per transaction",
    },
    price: {
      type: "string",
      label: "Price",
      description: "Whether the NFT is `Free` or `Paid`",
      options: [
        "Free",
        "Paid",
      ],
      optional: true,
    },
    pricePerNFT: {
      type: "string",
      label: "Price per NFT",
      description: "Price per NFT",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.niftykit.createMintLink({
      data: {
        NFTMetadata: {
          name: this.name,
          description: this.description,
          image: this.image,
        },
        maxAmount: +this.maxAmount,
        maxPerWallet: +this.maxPerWallet,
        maxPerTx: +this.maxPerTx,
        price: this.price,
        pricePerNFT: this.pricePerNFT
          ? +this.pricePerNFT
          : undefined,
      },
      $,
    });

    if (response?.id) {
      $.export("$summary", `Successfully created Mint Link with ID ${response.id}.`);
    }

    return response;
  },
};
