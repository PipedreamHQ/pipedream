import common from "./common.mjs";

export default {
  ...common,
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
        resourceFn: this.app.getActivities,
        resourceFnArgs: {
          boardId: this.boardId,
          params: {
            after: this.getLastComparable(),
          },
        },
        pagingCfg: {
          pageKey: "before",
          pageVal: "9999999999999999999", //near 2^64
          newVal(resources) {
            return resources[resources.length - 1]["id"];
          },
        },
      };
    },
    getComparable(item) {
      return item.id;
    },
    getMeta(item) {
      return {
        id: item?.id,
        summary: item?.description,
        ts: new Date(item?.created_at).getTime(),
      };
    },
  },
};
