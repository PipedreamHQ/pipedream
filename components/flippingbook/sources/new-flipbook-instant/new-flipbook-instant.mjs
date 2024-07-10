import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "flippingbook-new-flipbook-instant",
  name: "New Flipbook (Instant)",
  description: "Emit new event when a new flipbook is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookParams() {
      return {
        triggerOn: [
          "publication",
        ],
        events: [
          "created",
        ],
      };
    },
    async getObject(flipbookId) {
      const { publication } = await this.flippingbook.getFlipbook({
        flipbookId,
      });
      return publication;
    },
    generateMeta(flipbook) {
      return {
        id: flipbook.id,
        summary: `New Flipbook Created: ${flipbook.name}`,
        ts: Date.now(),
      };
    },
  },
  async run(event) {
    const { body: { objectId } } = event;
    const object = await this.getObject(objectId);
    this.$emit(object, this.generateMeta(object));
  },
  sampleEmit,
};
