import common from "../common/base.mjs";

export default {
  ...common,
  key: "mural-new-mural",
  name: "New Mural Created",
  description: "Emit new event when a new mural is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.mural.listMurals;
    },
    getArgs() {
      return {
        workspaceId: this.workspaceId,
        params: {
          sortBy: "lastCreated",
        },
      };
    },
    getSummary(item) {
      return `New Mural ID: ${item.id}`;
    },
  },
};
