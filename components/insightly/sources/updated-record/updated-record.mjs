import common from "../common/common.mjs";

export default {
  ...common,
  key: "insightly-updated-record",
  name: "Updated Record",
  description: "Emit new event when a new record is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTsKey() {
      return "DATE_UPDATED_UTC";
    },
    generateMeta(record) {
      const id = this.getRecordId(record);
      const ts = Date.parse(record[this.getTsKey()]);
      return {
        id: `${id}-${ts}`,
        summary: `Updated ${this.recordType} Record ${id}`,
        ts,
      };
    },
  },
};
