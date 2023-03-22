import base from "../common/base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...base,
  key: "bigml-new-model-created",
  name: "New Model Created",
  description: "Emit new event for every created model. [See docs here.](https://bigml.com/api/models?id=listing-models)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  hooks: {
    async deploy() {
      this.setLastDate(new Date());
      console.log("Retrieving historical events...");
      const { objects: models } = await this.bigml.listModels({
        params: {
          limit: constants.HISTORICAL_EVENTS_LIMIT,
        },
      });
      for (const model of models.reverse()) {
        this.emitEvent(model);
      }
    },
  },
  methods: {
    ...base.methods,
    emitEvent(model) {
      this.$emit(model, {
        id: model.resource,
        summary: `New model created: ${model.name}`,
        ts: model.created,
      });
    },
  },
  async run() {
    let offset = 0;

    while (true) {
      const lastDate = this.getLastDate();
      const currentDate = new Date();

      const { objects: models } = await this.bigml.listModels({
        paginate: true,
        params: {
          offset,
          limit: constants.MAX_LIMIT,
          created__gte: lastDate,
        },
      });

      this.setLastDate(currentDate);
      offset += models.length;

      if (models.length === 0) {
        return;
      }

      for (const model of models) {
        this.emitEvent(model);
      }
    }
  },
};
