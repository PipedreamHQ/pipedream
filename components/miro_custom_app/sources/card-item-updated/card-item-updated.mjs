import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "miro_custom_app-card-item-updated",
  name: "Card Item Updated",
  description: "Emit new event when a card item is updated on a Miro board",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(item) {
      const ts = Date.parse(item.modifiedAt);
      return {
        id: `${item.id}-${ts}`,
        summary: `Card Item Updated: ${item.id}`,
        ts,
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
      const ts = Date.parse(item.modifiedAt);
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
