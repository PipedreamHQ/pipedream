import common from "../common/common.mjs";

export default {
  ...common,
  key: "kanban_tool-new-card-type",
  name: "New Card Type Created Event",
  description: "Emit new events when a new card type is created on selected board. [See the docs](https://kanbantool.com/developer/api-v3#fetching-boards-details)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    boardId: {
      propDefinition: [
        common.props.app,
        "boardId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFnConfig() {
      return {
        resourceFn: this.app.getBoard,
        resourceKey: "card_types",
        resourceFnArgs: {
          boardId: this.boardId,
        },
        pagingCfg: {
          noPaging: true,
        },
      };
    },
    getComparable() {
      return new Date().getTime();
    },
    compareFn(item) {
      const ids = this.getIds();
      const condition = !ids.includes(item.id);
      if (condition) {
        this.setIds([
          item.id,
          ...ids,
        ]);
      }
      return condition;
    },
    getMeta(item) {
      return {
        id: item?.id,
        summary: `New card type created: ${item.name}(ID: ${item.id})`,
        ts: new Date(item?.created_at).getTime(),
      };
    },
  },
};
