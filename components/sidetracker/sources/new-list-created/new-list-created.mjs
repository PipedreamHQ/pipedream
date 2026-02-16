import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "sidetracker-new-list-created",
  name: "New List Created",
  description: "Emit new event when a new list is created. [See the documentation](https://app.sidetracker.io/api/schema/redoc#tag/Lists/operation/ListRetrieval)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.sidetracker.listLists;
    },
    generateMeta(item) {
      return {
        id: item.unique_id,
        summary: item.name,
        ts: Date.parse(item.created_at),
      };
    },
  },
};
