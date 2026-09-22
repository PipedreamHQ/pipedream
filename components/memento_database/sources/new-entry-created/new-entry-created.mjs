import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "memento_database-new-entry-created",
  name: "New Entry Created",
  description: "Emit new event when a new entry is created in Memento Database. [See the documentation](https://mementodatabase.docs.apiary.io/#reference/0/entries/list-entries-on-a-library)",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getTsField() {
      return "createdTime";
    },
    getResourceFn() {
      return this.mementoDatabase.listEntries;
    },
    generateMeta(entry) {
      return {
        id: entry.id,
        summary: `New Entry with ID: ${entry.id}`,
        ts: Date.parse(entry[this.getTsField()]),
      };
    },
  },
};
