import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "mistral_ai-new-model-added",
  name: "New Model Added",
  description: "Emit new event when a new AI model is registered or becomes available. [See the Documentation](https://docs.mistral.ai/api/#tag/models)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.mistralAI.listModels;
    },
    isPaginated() {
      return false;
    },
    generateMeta(model) {
      return {
        id: model.id,
        summary: `New Model: ${model.name}`,
        ts: model.created,
      };
    },
  },
  sampleEmit,
};
