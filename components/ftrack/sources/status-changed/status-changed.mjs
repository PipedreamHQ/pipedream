import common from "../common/polling.mjs";

export default {
  ...common,
  key: "ftrack-status-changed",
  name: "Status Changed",
  description: "Triggered when the status of an item is changed. [See the documentation](https://help.ftrack.com/en/articles/1040498-operations#query)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.listStatusChanges;
    },
    getResourceFnArgs() {
      return;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `Status Changed: ${resource.id}`,
        ts: Date.now(),
      };
    },
  },
};
