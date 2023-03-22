import base from "../common/base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...base,
  key: "bigml-new-prediction-made",
  name: "New Prediction Made",
  description: "Emit new event for every made prediction. [See docs here.](https://bigml.com/api/predictions?id=listing-predictions)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  hooks: {
    async deploy() {
      this.setLastDate(new Date());
      console.log("Retrieving historical events...");
      const { objects: predictions } = await this.bigml.listPredictions({
        params: {
          limit: constants.HISTORICAL_EVENTS_LIMIT,
        },
      });
      for (const prediction of predictions.reverse()) {
        this.emitEvent(prediction);
      }
    },
  },
  methods: {
    ...base.methods,
    emitEvent(prediction) {
      this.$emit(prediction, {
        id: prediction.resource,
        summary: `New prediction made: ${prediction.name}`,
        ts: prediction.created,
      });
    },
  },
  async run() {
    let offset = 0;

    while (true) {
      const lastDate = this.getLastDate();
      const currentDate = new Date();

      const { objects: predictions } = await this.bigml.listPredictions({
        paginate: true,
        params: {
          offset,
          limit: constants.MAX_LIMIT,
          created__gte: lastDate,
        },
      });

      this.setLastDate(currentDate);
      offset += predictions.length;

      if (predictions.length === 0) {
        return;
      }

      for (const prediction of predictions) {
        this.emitEvent(prediction);
      }
    }
  },
};
