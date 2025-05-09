import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "letzai-new-image-edit",
  name: "New Image Edit Created",
  description: "Emit new event when a new image edit is created in LetzAI. [See the documentation](https://api.letz.ai/doc#/image-edit/image_edit_find)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.letzai.listImageEdits;
    },
    getSummary(item) {
      return `New image edit created: ${item.prompt || item.id}`;
    },
  },
  sampleEmit,
};
