import common from "../common/base.mjs";

export default {
  ...common,
  key: "leap-new-model-version-created",
  name: "New Model Version Created",
  description: "Emit new event when a new model version is created/queued for training. [See the documentation](https://docs.tryleap.ai/reference/versionscontroller_findall-1)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    model: {
      propDefinition: [
        common.props.leap,
        "model",
      ],
    },
  },
  methods: {
    ...common.methods,
    async processHistoricalEvents({ limit }) {
      const modelVersions = await this.leap.listModelVersions({
        modelId: this.model,
      });
      if (!modelVersions?.length) {
        return;
      }

      let maxLastCreated = 0;
      for (const modelVersion of modelVersions.slice(limit * -1)) {
        this.emitEvent(modelVersion);
        const ts = Date.parse(modelVersion.createdAt);
        if (ts > maxLastCreated) {
          maxLastCreated = ts;
        }
      }
      this._setLastCreated(maxLastCreated);
    },
    generateMeta(modelVersion) {
      return {
        id: modelVersion.id,
        summary: `ID: ${modelVersion.id}`,
        ts: Date.parse(modelVersion.createdAt),
      };
    },
    async processEvent() {
      const lastCreated = this._getPrevious() || 0;
      let maxLastCreated = lastCreated;

      const modelVersions = await this.leap.listModelVersions({
        modelId: this.model,
      });
      if (!modelVersions.length) {
        return;
      }
      for (const modelVersion of modelVersions) {
        const ts = Date.parse(modelVersion.createdAt);
        if (ts > lastCreated) {
          this.emitEvent(modelVersion);
          if (ts > maxLastCreated) {
            maxLastCreated = ts;
          }
        }
      }
      this._setPrevious(maxLastCreated);
    },
  },
};
