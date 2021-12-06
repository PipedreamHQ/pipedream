import common from "./common.mjs";

export default {
  ...common,
  methods: {
    ...common.methods,
    async getSyncResult() {
      return this.todoist.syncProjects(this.db);
    },
    filterResults(syncResult) {
      return Object.values(syncResult)
      .filter(Array.isArray)
      .flat();
    },
    emitResults(results) {
      for (const element of results) {
        element.summary = `Project: ${element.id}`;
        const meta = this.generateMeta(element);
        this.$emit(element, meta);
      }
    }
  },
};
