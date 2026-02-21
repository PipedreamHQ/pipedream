import common from "../common.mjs";

export default {
  ...common,
  key: "todoist-new-section",
  name: "New Section",
  description: "Emit new event for each new section added. [See the documentation](https://developer.todoist.com/api/v1#tag/Sync/Overview/Read-resources)",
  version: "0.0.8",
  type: "source",
  dedupe: "greatest",
  methods: {
    ...common.methods,
    async getSyncResult() {
      return this.todoist.syncSections(this.db);
    },
    emitResults(results) {
      for (const element of results) {
        element.summary = `Section: ${element.id}`;
        const meta = this.generateMeta(element);
        this.$emit(element, meta);
      }
    },
  },
};
