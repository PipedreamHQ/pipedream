import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "graceblocks-new-record-created",
  name: "New Record Created",
  description: "Emit new event when a new record is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.graceblocks.listRecords;
    },
    getParams() {
      return {
        sortField: this.getTsField(),
        sortOrder: "desc",
      };
    },
    getTsField() {
      return "Added on";
    },
    generateMeta(record) {
      return {
        id: record.id,
        summary: `New Record: ${record.Name}`,
        ts: Date.parse(record[this.getTsField()]),
      };
    },
  },
};
