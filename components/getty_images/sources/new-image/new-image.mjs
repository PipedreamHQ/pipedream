import gettyImages from "../../getty_images.app.mjs";
import base from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "getty_images-new-image",
  name: "New Board Asset",
  description: "Emit new event each time an asset is added to a Getty Images board. Polls the board's asset list on a schedule. [See the documentation](https://developers.gettyimages.com/docs/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...base.props,
    boardId: {
      propDefinition: [
        gettyImages,
        "boardId",
      ],
    },
  },
  methods: {
    ...base.methods,
    generateMeta(asset) {
      const parsedTs = asset.date_added
        ? Date.parse(asset.date_added)
        : NaN;
      return {
        id: asset.id,
        summary: `New asset added to board: ${asset.id}`,
        ts: Number.isFinite(parsedTs)
          ? parsedTs
          : Date.now(),
      };
    },
    async emitEvent(maxResults) {
      const { assets = [] } = await this.gettyImages.getBoardAssets({
        boardId: this.boardId,
      });

      const toEmit = maxResults
        ? assets.slice(0, maxResults)
        : assets;

      for (const asset of toEmit) {
        this.$emit(asset, this.generateMeta(asset));
      }
    },
  },
  sampleEmit,
};
