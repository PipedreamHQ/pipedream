import common from "./common.mjs";

export default {
  ...common,
  methods: {
    ...common.methods,
    getResourceFnConfig() {
      return {
        resourceFn: this.app.getActivities,
        resourceFnArgs: {
          boardId: this.boardId,
          params: {
            must: [
              {
                range: {
                  date_created: {
                    gte: this.getLastComparable(),
                  },
                },
              },
            ],
          },
        },
        resourceKey: "activity",
      };
    },
    getComparable(item) {
      return item.date_created;
    },
    getMeta(item) {
      return {
        id: item.date_created,
        summary: item.note,
        ts: item.date_created * 1000,
      };
    },
  },
};
