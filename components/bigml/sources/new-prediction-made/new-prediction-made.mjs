import base from "../common/base.mjs";

export default {
  ...base,
  key: "bigml-new-prediction-made",
  name: "New Prediction Made",
  description: "Emit new event for every made prediction. [See docs here.](https://bigml.com/api/predictions?id=listing-predictions)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    listingFunction() {
      return this.bigml.listPredictions;
    },
    emitEvent(prediction) {
      this.$emit(prediction, {
        id: prediction.resource,
        summary: `New prediction made: ${prediction.name}`,
        ts: prediction.created,
      });
    },
  },
};
