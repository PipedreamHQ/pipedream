import common from "../common/base.mjs";

export default {
  ...common,
  key: "leap-new-model-created",
  name: "New Model Created",
  description: "Emit new event when a new model is created. [See the documentation](https://docs.tryleap.ai/reference/listallmodels)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async processHistoricalEvents({ limit }) {
      const models = await this.leap.listModels();
      if (!models?.length) {
        return;
      }

      const processedIds = {};
      models.map(({ id }) => processedIds[id] = true );
      this._setPrevious(processedIds);

      for (const model of models.slice(limit * -1)) {
        this.emitEvent(model);
      }
    },
    generateMeta(model) {
      return {
        id: model.id,
        summary: model.title,
        ts: Date.now(),
      };
    },
    async processEvent() {
      const processedIds = this._getPrevious() || {};
      const models = await this.leap.listModels();
      if (!models?.length) {
        return;
      }
      for (const model of models) {
        if (!processedIds[model.id]) {
          processedIds[model.id] = true;
          this.emitEvent(model);
        }
      }
      this._setPrevious(processedIds);
    },
  },
};
