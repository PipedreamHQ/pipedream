import common from "../common/common.mjs";

export default {
  ...common,
  key: "insightly-new-record",
  name: "New Record",
  description: "Emit new event when a new record is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTsKey() {
      return "DATE_CREATED_UTC";
    },
    generateMeta(record) {
      const id = this.getRecordId(record);
      return {
        id,
        summary: `New ${this.recordType} Record ${id}`,
        ts: Date.parse(record[this.getTsKey()]),
      };
    },
  },
};
