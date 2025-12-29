import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "memento_database-entry-updated",
  name: "Entry Updated",
  description: "Emit new event when an entry is updated in Memento Database. [See the documentation](https://mementodatabase.docs.apiary.io/#reference/0/entries/list-entries-on-a-library)",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getTsField() {
      return "modifiedTime";
    },
    getResourceFn() {
      return this.mementoDatabase.listEntries;
    },
    isRelevant(entry) {
      return entry.modifiedTime !== entry.createdTime;
    },
    generateMeta(entry) {
      const ts = Date.parse(entry[this.getTsField()]);
      return {
        id: `${entry.id}-${ts}`,
        summary: `Entry Updated with ID: ${entry.id}`,
        ts,
      };
    },
  },
};
