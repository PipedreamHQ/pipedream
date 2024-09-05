import summit from "../../summit.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "summit-new-model-added",
  name: "New Model Added",
  description: "Emit new event when a new model is added to your organization in Summit. [See the documentation](https://summit.readme.io/reference/apps)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    summit,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  methods: {
    generateMeta(model) {
      return {
        id: model.id,
        summary: `New Modle ${model.name}`,
        ts: Date.now(),
      };
    },
    async processEvent(max) {
      const results = this.summit.paginate({
        resourceFn: this.summit.listModels,
        resourceType: "apps",
        max,
      });
      for await (const model of results) {
        const meta = this.generateMeta(model);
        this.$emit(model, meta);
      }
    },
  },
  async run() {
    await this.processEvent();
  },
};
