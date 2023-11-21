import common from "../common/base.mjs";

export default {
  ...common,
  key: "niftykit-new-nft-minted",
  name: "New NFT Minted",
  description: "Emit new event when a new NFT is minted in NiftyKit. [See the documentation](https://api.niftykit.com/docs?_gl=1*d8mlfi*_ga*MTY5MTM2MjIwNi4xNjk0MDMzOTk3*_ga_B0DCGWCR37*MTY5NzE0MTUzNy40LjAuMTY5NzE0MTUzNy42MC4wLjA.#/collections/CollectionsController_getTokens)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getItems() {
      const { data } = await this.niftykit.listTokens({
        params: {
          all: true,
        },
      });
      return data;
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New NFT Minted ID ${item.id}`,
        ts: Date.parse(item.createdAt),
      };
    },
  },
};
