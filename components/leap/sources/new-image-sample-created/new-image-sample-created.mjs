import common from "../common/base.mjs";

export default {
  ...common,
  key: "leap-new-image-sample-created",
  name: "New Image Sample Created",
  description: "Emit new event when a new image sample is created for a model. [See the documentation](https://docs.tryleap.ai/reference/samplescontroller_findall-1)",
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
      const images = await this.leap.listImages({
        modelId: this.model,
      });
      if (!images?.length) {
        return;
      }

      let maxLastCreated = 0;
      for (const image of images.slice(limit * -1)) {
        this.emitEvent(image);
        const ts = Date.parse(image.createdAt);
        if (ts > maxLastCreated) {
          maxLastCreated = ts;
        }
      }
      this._setPrevious(maxLastCreated);
    },
    generateMeta(image) {
      return {
        id: image.id,
        summary: image.uri,
        ts: Date.parse(image.createdAt),
      };
    },
    async processEvent() {
      const lastCreated = this._getPrevious() || 0;
      let maxLastCreated = lastCreated;

      const images = await this.leap.listImages({
        modelId: this.model,
      });
      if (!images.length) {
        return;
      }
      for (const image of images) {
        const ts = Date.parse(image.createdAt);
        if (ts > lastCreated) {
          this.emitEvent(image);
          if (ts > maxLastCreated) {
            maxLastCreated = ts;
          }
        }
      }
      this._setPrevious(maxLastCreated);
    },
  },
};
