import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "miro_custom_app-new-card-item-created",
  name: "New Card Item Created",
  description: "Emit new event when a new card item is created on a Miro board",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New Card Item Created: ${item.id}`,
        ts: Date.parse(item.createdAt),
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;
    const items = this.paginate({
      resourceFn: this.miro.listItems,
      args: {
        boardId: this.boardId,
        params: {
          type: "card",
        },
      },
    });
    for await (const item of items) {
      const ts = Date.parse(item.createdAt);
      if (ts > lastTs) {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
        maxTs = Math.max(maxTs, ts);
      }
    }
    this._setLastTs(maxTs);
  },
  sampleEmit,
};
