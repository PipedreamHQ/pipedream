import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "letzai-new-image",
  name: "New Image Created",
  description: "Emit new event when a new image is created in LetzAI. [See the documentation](https://api.letz.ai/doc#/images/images_find)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.letzai.listImages;
    },
    getSummary(item) {
      return `New image created: ${item.prompt}`;
    },
  },
  sampleEmit,
};
