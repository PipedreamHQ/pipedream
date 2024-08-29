import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "openai-new-batch-completed",
  name: "New Batch Completed",
  description: "Emit new event when a new batch is completed in OpenAI. [See the documentation](https://platform.openai.com/docs/api-reference/batch/list)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getLastCompleted() {
      return this.db.get("lastCompleted") || 0;
    },
    _setLastCompleted(lastCompleted) {
      this.db.set("lastCompleted", lastCompleted);
    },
    getMeta(batch) {
      return {
        id: batch.id,
        summary: `Batch Completed with ID ${batch.id}`,
        ts: batch.completed_at * 1000,
      };
    },
    async getAndProcessItems(max) {
      const lastCompleted = this._getLastCompleted();
      let maxCompleted = lastCompleted;
      const results = this.openai.paginate({
        resourceFn: this.openai.listBatches,
        max,
      });
      const batches = [];
      for await (const batch of results) {
        if (batch.completed_at && batch.completed_at > lastCompleted) {
          batches.push(batch);
          maxCompleted = Math.max(batch.completed_at, maxCompleted);
        }
      }
      this._setLastCompleted(maxCompleted);
      batches.reverse().forEach((item) => this.$emit(item, this.getMeta(item)));
    },
  },
  sampleEmit,
};
