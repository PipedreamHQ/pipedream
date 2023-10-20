import common from "../common/common.mjs";

export default {
  ...common,
  key: "kanban_tool-new-board",
  name: "New Board Created Event",
  description: "Emit new events when a new board is created or given access for a new board. [See the docs](https://kanbantool.com/developer/api-v3#listing-boards)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFnConfig() {
      return {
        resourceFn: this.app.getUser,
        resourceKey: "boards",
        pagingCfg: {
          noPaging: true,
        },
      };
    },
    async getItem(item) {
      return this.app.getBoard({
        boardId: item.id,
      });
    },
    getComparable(item) {
      return new Date(item?.created_at).getTime();
    },
    getMeta(item) {
      return {
        id: item?.id,
        summary: `New board created: ${item.name}(ID: ${item.id})`,
        ts: new Date(item?.created_at).getTime(),
      };
    },
  },
};
