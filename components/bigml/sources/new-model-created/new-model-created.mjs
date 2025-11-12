import base from "../common/base.mjs";

export default {
  ...base,
  key: "bigml-new-model-created",
  name: "New Model Created",
  description: "Emit new event for every created model. [See docs here.](https://bigml.com/api/models?id=listing-models)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    listingFunction() {
      return this.bigml.listModels;
    },
    emitEvent(model) {
      this.$emit(model, {
        id: model.resource,
        summary: `New model created: ${model.name}`,
        ts: model.created,
      });
    },
  },
};
